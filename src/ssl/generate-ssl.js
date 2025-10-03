const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const sslDir = path.join(__dirname, '../..', 'ssl');
console.log('>>> sslDir: ', sslDir);

// Создаем папку ssl если не существует
if (!fs.existsSync(sslDir)) {
	fs.mkdirSync(sslDir, { recursive: true });
}

console.log('Generating SSL certificates for development...');

try {
	// Генерируем приватный ключ
	execSync(`openssl genrsa -out ${sslDir}/localhost.key 2048`, { stdio: 'inherit' });

	// Генерируем CSR
	execSync(
		`openssl req -new -key ${sslDir}/localhost.key -out ${sslDir}/localhost.csr -subj "/C=US/ST=State/L=City/O=Organization/OU=OrgUnit/CN=localhost"`,
		{ stdio: 'inherit' },
	);

	// Генерируем самоподписанный сертификат
	execSync(`openssl x509 -req -days 365 -in ${sslDir}/localhost.csr -signkey ${sslDir}/localhost.key -out ${sslDir}/localhost.crt`, {
		stdio: 'inherit',
	});

	// Удаляем CSR файл
	fs.unlinkSync(path.join(sslDir, 'localhost.csr'));

	console.log('SSL certificates generated successfully!');
	console.log(`Key: ${sslDir}/localhost.key`);
	console.log(`Cert: ${sslDir}/localhost.crt`);
} catch (error) {
	console.error('Failed to generate SSL certificates:', error.message);
	console.log('Make sure OpenSSL is installed on your system');
}
