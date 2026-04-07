import crypto from 'crypto';
import fs from 'fs';

function encrypt(password, dataStr) {
  const passwordBuffer = Buffer.from(password, 'utf-8');
  const dataBuffer = Buffer.from(dataStr, 'utf-8');
  const salt = crypto.randomBytes(16);
  const iv = crypto.randomBytes(12);
  const key = crypto.pbkdf2Sync(passwordBuffer, salt, 100000, 32, 'sha256');
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(dataBuffer), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([salt, iv, tag, encrypted]).toString('base64');
}

const pass = "ACG2000";
const content = `
  <div class="text-center bg-white p-8 rounded-2xl shadow-xl max-w-4xl mx-auto mt-10 border border-slate-100">
    <h1 class="text-4xl font-extrabold text-slate-900 mb-4 flex justify-center items-center gap-2">
      <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z"></path></svg>
      Acceso Autorizado
    </h1>
    <p class="text-slate-600 text-lg mb-6">Zona <strong>#Admin</strong>, sólo los administradores pueden verla.</p>
    <div class="bg-blue-50 p-6 rounded-lg text-left border border-blue-100">
      <h3 class="font-bold text-blue-800 mb-2">Sección Admin</h3>
      <p class="text-slate-700">Aquí puedes añadir información Administrativa.</p>
    </div>
  </div>
`;

const b64 = encrypt(pass, content);
fs.writeFileSync('payload.txt', b64);
console.log("Written to payload.txt");
