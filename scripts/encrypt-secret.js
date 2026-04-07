import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

// Usage: node encrypt-secret.js "your-password" "<strong>HTML Content</strong>"

function encrypt(password, dataStr) {
  // 1. Convert strings to buffers
  const passwordBuffer = Buffer.from(password, 'utf-8');
  const dataBuffer = Buffer.from(dataStr, 'utf-8');

  // 2. Generate random Salt (16 bytes) and IV (12 bytes for AES-GCM)
  const salt = crypto.randomBytes(16);
  const iv = crypto.randomBytes(12);

  // 3. Derive key using PBKDF2 (100,000 iterations, SHA-256, 32-byte key)
  // MUST match the client-side decryption exact parameters!
  const key = crypto.pbkdf2Sync(passwordBuffer, salt, 100000, 32, 'sha256');

  // 4. Create Cipher (AES-256-GCM)
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  
  // 5. Encrypt data
  const encrypted = Buffer.concat([cipher.update(dataBuffer), cipher.final()]);
  
  // 6. Get auth tag (16 bytes)
  const tag = cipher.getAuthTag();

  // 7. Combine everything into one single buffer:
  // Layout: [Salt (16)] + [IV (12)] + [AuthTag (16)] + [Ciphertext (*)]
  const combinedBuffer = Buffer.concat([salt, iv, tag, encrypted]);

  // 8. Convert to Base64 for easy transport to the frontend
  return combinedBuffer.toString('base64');
}

const args = process.argv.slice(2);
if (args.length < 2) {
  console.log("Uso: node encrypt-secret.js <contraseña> <contenido_html>");
  console.log("Ejemplo: node encrypt-secret.js 'ACG2000' '<h1>Secreto</h1>'");
  process.exit(1);
}

const pass = args[0];
const html = args[1];

const base64Payload = encrypt(pass, html);
console.log("\n=================== RESULTADO CIFRADO ===================");
console.log(base64Payload);
console.log("=========================================================\n");
console.log("Copia esta cadena y pégala dentro del archivo src/pages/lunatuna.astro en la variable 'encryptedBase64Payload'.");
