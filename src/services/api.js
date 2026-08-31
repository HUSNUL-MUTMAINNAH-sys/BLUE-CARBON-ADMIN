// API Service untuk Web Admin — akses langsung ke Supabase (Postgres + Storage)
// menggantikan backend Express + file JSON. Keamanan write diatur oleh
// Row Level Security (RLS) di Supabase, bukan oleh server perantara.
import { supabase } from '../lib/supabaseClient';

// ================== HELPER: UPLOAD FOTO KE SUPABASE STORAGE ==================

function dataUrlToBlob(dataUrl) {
  const [header, base64] = dataUrl.split(',');
  const mimeMatch = header.match(/data:(.*?);base64/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

// Jika value adalah base64 data URL (foto baru yang baru dipilih di form),
// upload ke Supabase Storage dan kembalikan public URL-nya. Jika value
// sudah berupa URL biasa (foto lama / tidak berubah), kembalikan apa adanya.
async function uploadImageIfNeeded(bucket, value, prefix) {
  if (!value || typeof value !== 'string' || !value.startsWith('data:')) {
    return value ?? null;
  }

  const blob = dataUrlToBlob(value);
  const ext = (blob.type.split('/')[1] || 'jpg').replace('+xml', '');
  const filename = `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filename, blob, { contentType: blob.type, upsert: false });

  if (uploadError) {
    throw new Error(`Gagal upload foto: ${uploadError.message}`);
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(filename);
  return data.publicUrl;
}

function handle(result, fallbackMessage) {
  const { data, error } = result;
  if (error) {
    throw new Error(error.message || fallbackMessage);
  }
  return data;
}

// ================== DATA LAHAN ==================

export async function getAllLahan() {
  try {
    const result = await supabase.from('lahan').select('*').order('id', { ascending: true });
    return handle(result, 'Gagal mengambil data');
  } catch (error) {
    console.error('Error fetching lahan:', error);
    throw error;
  }
}

export async function getLahanById(id) {
  try {
    const result = await supabase.from('lahan').select('*').eq('id', id).single();
    return handle(result, 'Lahan tidak ditemukan');
  } catch (error) {
    console.error('Error fetching lahan detail:', error);
    throw error;
  }
}

export async function createLahan(payload) {
  try {
    const data = { ...payload };
    data.foto = await uploadImageIfNeeded('foto-lahan', data.foto, 'lahan');

    const result = await supabase.from('lahan').insert(data).select().single();
    return handle(result, 'Gagal menambahkan lahan');
  } catch (error) {
    console.error('Error creating lahan:', error);
    throw error;
  }
}

export async function updateLahan(id, payload) {
  try {
    const data = { ...payload };
    delete data.id;
    delete data.created_at;
    data.foto = await uploadImageIfNeeded('foto-lahan', data.foto, 'lahan');

    const result = await supabase.from('lahan').update(data).eq('id', id).select().single();
    return handle(result, 'Gagal mengupdate lahan');
  } catch (error) {
    console.error('Error updating lahan:', error);
    throw error;
  }
}

export async function deleteLahan(id) {
  try {
    const result = await supabase.from('lahan').delete().eq('id', id).select().single();
    return handle(result, 'Gagal menghapus lahan');
  } catch (error) {
    console.error('Error deleting lahan:', error);
    throw error;
  }
}

// ================== DATA PELAKU RUMPUT LAUT ==================

export async function getAllPelaku() {
  try {
    const result = await supabase.from('pelaku').select('*').order('id', { ascending: true });
    return handle(result, 'Gagal mengambil data pelaku');
  } catch (error) {
    console.error('Error fetching pelaku:', error);
    throw error;
  }
}

export async function getPelakuById(id) {
  try {
    const result = await supabase.from('pelaku').select('*').eq('id', id).single();
    return handle(result, 'Data pelaku tidak ditemukan');
  } catch (error) {
    console.error('Error fetching pelaku detail:', error);
    throw error;
  }
}

export async function createPelaku(payload) {
  try {
    const data = { ...payload };
    data.foto = await uploadImageIfNeeded('foto-lahan', data.foto, 'pelaku');

    const result = await supabase.from('pelaku').insert(data).select().single();
    return handle(result, 'Gagal menambahkan data pelaku');
  } catch (error) {
    console.error('Error creating pelaku:', error);
    throw error;
  }
}

export async function updatePelaku(id, payload) {
  try {
    const data = { ...payload };
    delete data.id;
    delete data.created_at;
    data.foto = await uploadImageIfNeeded('foto-lahan', data.foto, 'pelaku');

    const result = await supabase.from('pelaku').update(data).eq('id', id).select().single();
    return handle(result, 'Gagal mengupdate data pelaku');
  } catch (error) {
    console.error('Error updating pelaku:', error);
    throw error;
  }
}

export async function deletePelaku(id) {
  try {
    const result = await supabase.from('pelaku').delete().eq('id', id).select().single();
    return handle(result, 'Gagal menghapus data pelaku');
  } catch (error) {
    console.error('Error deleting pelaku:', error);
    throw error;
  }
}

// ================== BERITA ==================

export async function getAllBerita(status) {
  try {
    let query = supabase.from('berita').select('*').order('tanggal', { ascending: false });
    if (status) query = query.eq('status', status);
    const result = await query;
    return handle(result, 'Gagal mengambil data berita');
  } catch (error) {
    console.error('Error fetching berita:', error);
    throw error;
  }
}

export async function getBeritaById(id) {
  try {
    const result = await supabase.from('berita').select('*').eq('id', id).single();
    return handle(result, 'Berita tidak ditemukan');
  } catch (error) {
    console.error('Error fetching berita detail:', error);
    throw error;
  }
}

export async function createBerita(payload) {
  try {
    const data = { ...payload };
    data.gambar = await uploadImageIfNeeded('foto-lahan', data.gambar, 'berita');

    const result = await supabase.from('berita').insert(data).select().single();
    return handle(result, 'Gagal menambahkan berita');
  } catch (error) {
    console.error('Error creating berita:', error);
    throw error;
  }
}

export async function updateBerita(id, payload) {
  try {
    const data = { ...payload };
    delete data.id;
    delete data.created_at;
    data.gambar = await uploadImageIfNeeded('foto-lahan', data.gambar, 'berita');

    const result = await supabase.from('berita').update(data).eq('id', id).select().single();
    return handle(result, 'Gagal mengupdate berita');
  } catch (error) {
    console.error('Error updating berita:', error);
    throw error;
  }
}

export async function deleteBerita(id) {
  try {
    const result = await supabase.from('berita').delete().eq('id', id).select().single();
    return handle(result, 'Gagal menghapus berita');
  } catch (error) {
    console.error('Error deleting berita:', error);
    throw error;
  }
}

// ================== MRV / MONITORING ==================

export async function getAllMonitoring(landId) {
  try {
    let query = supabase.from('monitoring').select('*').order('monitoring_date', { ascending: false });
    if (landId) query = query.eq('land_id', landId);
    const result = await query;
    return handle(result, 'Gagal mengambil data monitoring');
  } catch (error) {
    console.error('Error fetching monitoring:', error);
    throw error;
  }
}

export async function getMonitoringById(id) {
  try {
    const result = await supabase.from('monitoring').select('*').eq('id', id).single();
    return handle(result, 'Data monitoring tidak ditemukan');
  } catch (error) {
    console.error('Error fetching monitoring detail:', error);
    throw error;
  }
}

export async function createMonitoring(payload) {
  try {
    const { land_id, monitoring_date, production, revenue } = payload;

    if (!land_id || !monitoring_date || production === undefined || production === null || revenue === undefined || revenue === null) {
      throw new Error('Field wajib: land_id, monitoring_date, production, revenue');
    }
    if (isNaN(parseFloat(production)) || parseFloat(production) <= 0) {
      throw new Error('Produksi harus berupa angka positif');
    }
    if (isNaN(parseFloat(revenue)) || parseFloat(revenue) <= 0) {
      throw new Error('Penghasilan panen harus berupa angka positif');
    }
    if (isNaN(new Date(monitoring_date).getTime())) {
      throw new Error('Tanggal monitoring tidak valid');
    }

    const result = await supabase
      .from('monitoring')
      .insert({
        land_id: parseInt(land_id),
        monitoring_date,
        production: parseFloat(production),
        revenue: parseFloat(revenue),
      })
      .select()
      .single();

    return handle(result, 'Gagal menambahkan data monitoring');
  } catch (error) {
    console.error('Error creating monitoring:', error);
    throw error;
  }
}

export async function updateMonitoring(id, payload) {
  try {
    const data = { ...payload };
    delete data.id;
    delete data.created_at;
    if (data.land_id !== undefined) data.land_id = parseInt(data.land_id);
    if (data.production !== undefined) data.production = parseFloat(data.production);
    if (data.revenue !== undefined) data.revenue = parseFloat(data.revenue);

    const result = await supabase.from('monitoring').update(data).eq('id', id).select().single();
    return handle(result, 'Gagal mengupdate data monitoring');
  } catch (error) {
    console.error('Error updating monitoring:', error);
    throw error;
  }
}

export async function deleteMonitoring(id) {
  try {
    const result = await supabase.from('monitoring').delete().eq('id', id).select().single();
    return handle(result, 'Gagal menghapus data monitoring');
  } catch (error) {
    console.error('Error deleting monitoring:', error);
    throw error;
  }
}

// ================== HELPERS ==================

export function formatRupiah(angka) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(angka);
}

export function parseRupiah(rupiahString) {
  if (typeof rupiahString === 'number') return rupiahString;
  return parseInt(rupiahString.replace(/[^0-9]/g, '')) || 0;
}
