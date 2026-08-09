const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// 1. Charger .env.local
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  envConfig.split(/\r?\n/).forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const equalsIdx = trimmed.indexOf('=');
      if (equalsIdx !== -1) {
        const key = trimmed.slice(0, equalsIdx).trim();
        const value = trimmed.slice(equalsIdx + 1).trim();
        process.env[key] = value;
      }
    }
  });
}

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  console.error('❌ Erreur : CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY ou CLOUDINARY_API_SECRET manquant dans .env.local');
  process.exit(1);
}

const BASE_FOLDER = 'akatech/images';
const imagesDir = path.join(__dirname, '..', 'public', 'images');
// Mémoire locale des empreintes déjà envoyées — permet de sauter les fichiers
// inchangés d'un run à l'autre au lieu de re-uploader les 145 images à chaque
// fois. Purement local (jamais commité), voir .gitignore.
const manifestPath = path.join(__dirname, '.cloudinary-manifest.json');
const FORCE = process.argv.includes('--force');

function loadManifest() {
  if (FORCE) return {};
  try {
    return JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  } catch {
    return {};
  }
}

function fileHash(filePath) {
  return crypto.createHash('md5').update(fs.readFileSync(filePath)).digest('hex');
}

function getFilesRecursively(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFilesRecursively(filePath));
    } else {
      results.push(filePath);
    }
  });
  return results;
}

function generateSignature(params, secret) {
  const sortedKeys = Object.keys(params).sort();
  const toSign = sortedKeys.map(k => `${k}=${params[k]}`).join('&') + secret;
  return crypto.createHash('sha1').update(toSign).digest('hex');
}

async function uploadFile(filePath, relativePath) {
  const ext = path.extname(relativePath);
  const relativePathNoExt = relativePath.slice(0, relativePath.length - ext.length);
  const publicId = `${BASE_FOLDER}/${relativePathNoExt}`;

  const isVideo = ['.webm', '.mp4', '.mov'].includes(ext.toLowerCase());
  const resourceType = isVideo ? 'video' : 'image';

  const timestamp = Math.floor(Date.now() / 1000);
  const paramsToSign = {
    overwrite: 'true',
    public_id: publicId,
    timestamp: timestamp
  };

  const signature = generateSignature(paramsToSign, apiSecret);

  const fileBuffer = fs.readFileSync(filePath);
  const blob = new Blob([fileBuffer]);

  const formData = new FormData();
  formData.append('file', blob, path.basename(filePath));
  formData.append('api_key', apiKey);
  formData.append('timestamp', timestamp);
  formData.append('public_id', publicId);
  formData.append('overwrite', 'true');
  formData.append('signature', signature);

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

  const response = await fetch(url, {
    method: 'POST',
    body: formData
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error ? data.error.message : JSON.stringify(data));
  }
  return data;
}

async function uploadAll() {
  if (!fs.existsSync(imagesDir)) {
    console.error("❌ Le dossier public/images n'existe pas.");
    return;
  }

  const manifest = loadManifest();
  const files = getFilesRecursively(imagesDir);
  console.log(`🚀 Vérification de ${files.length} fichiers vers Cloudinary (${cloudName})...${FORCE ? ' (--force : tout réenvoyer)' : ''}\n`);

  let successCount = 0;
  let failCount = 0;
  let skippedCount = 0;
  const seenPaths = new Set();

  for (const filePath of files) {
    const relativePath = path.relative(imagesDir, filePath).replace(/\\/g, '/');
    seenPaths.add(relativePath);
    const hash = fileHash(filePath);

    if (manifest[relativePath] === hash) {
      skippedCount++;
      continue;
    }

    try {
      console.log(`⏳ Uploading [${relativePath}]...`);
      const res = await uploadFile(filePath, relativePath);
      console.log(`  ✅ Succès: ${res.secure_url}`);
      manifest[relativePath] = hash;
      successCount++;
    } catch (err) {
      console.error(`  ❌ Échec pour ${relativePath}:`, err.message);
      failCount++;
    }
  }

  // Fichiers supprimés localement depuis le dernier run : retirés de la
  // mémoire (pas de leur copie Cloudinary, au cas où ils servent encore
  // ailleurs) — sinon un fichier recréé plus tard avec le même contenu
  // serait à tort considéré "déjà à jour" et jamais réenvoyé.
  for (const knownPath of Object.keys(manifest)) {
    if (!seenPaths.has(knownPath)) delete manifest[knownPath];
  }

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

  console.log(`\n🎉 Terminé ! Envoyés: ${successCount}, Déjà à jour (ignorés): ${skippedCount}, Échecs: ${failCount}`);
  if (skippedCount > 0) console.log(`💡 Pour tout renvoyer quand même : node scripts/upload-cloudinary.js --force`);
}

uploadAll();
