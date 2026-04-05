const statusMessage = document.getElementById("statusMessage");
const inventoryBody = document.getElementById("inventoryBody");
const totalSkuEl = document.getElementById("totalSku");
const totalStockEl = document.getElementById("totalStock");
const latestUpdateEl = document.getElementById("latestUpdate");
const refreshButton = document.getElementById("refreshButton");

const appConfig = window.APP_CONFIG || {};

function setStatus(message, tone = "") {
  statusMessage.textContent = message;
  statusMessage.className = "status-message";

  if (tone) {
    statusMessage.classList.add(tone);
  }
}

function formatToWIB(isoString) {
  if (!isoString) {
    return "-";
  }

  const date = new Date(isoString);
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  }).format(date);
}

function computeSummary(products) {
  const totalSku = products.length;
  const totalStock = products.reduce(
    (sum, item) => sum + Number(item.stock_count || 0),
    0,
  );

  const latestDate = products
    .map((item) => new Date(item.last_updated))
    .filter((date) => !Number.isNaN(date.getTime()))
    .sort((a, b) => b.getTime() - a.getTime())[0];

  totalSkuEl.textContent = String(totalSku);
  totalStockEl.textContent = String(totalStock);
  latestUpdateEl.textContent = latestDate
    ? formatToWIB(latestDate.toISOString())
    : "-";
}

function renderRows(products) {
  if (!products.length) {
    inventoryBody.innerHTML =
      '<tr><td colspan="3" class="empty-state">Belum ada produk.</td></tr>';
    return;
  }

  const rows = products
    .map((product) => {
      const lowStockClass = product.stock_count <= 15 ? "low-stock" : "";
      return `
        <tr>
          <td>${product.name}</td>
          <td class="${lowStockClass}">${product.stock_count}</td>
          <td>${formatToWIB(product.last_updated)}</td>
        </tr>
      `;
    })
    .join("");

  inventoryBody.innerHTML = rows;
}

async function fetchProducts() {
  if (!appConfig.SUPABASE_URL || !appConfig.SUPABASE_ANON_KEY) {
    setStatus(
      "Konfigurasi belum lengkap. Salin config.example.js menjadi config.js lalu isi kredensial Supabase.",
      "error",
    );
    return;
  }

  setStatus("Mengambil data dari Supabase...");
  refreshButton.disabled = true;

  try {
    const endpoint = `${appConfig.SUPABASE_URL}/rest/v1/products?select=name,stock_count,last_updated&order=last_updated.desc`;

    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        apikey: appConfig.SUPABASE_ANON_KEY,
        Authorization: `Bearer ${appConfig.SUPABASE_ANON_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Request gagal dengan status ${response.status}`);
    }

    const data = await response.json();
    renderRows(data);
    computeSummary(data);
    setStatus(`Data berhasil dimuat. Total ${data.length} produk.`, "success");
  } catch (error) {
    inventoryBody.innerHTML =
      '<tr><td colspan="3" class="empty-state">Gagal memuat data.</td></tr>';
    totalSkuEl.textContent = "-";
    totalStockEl.textContent = "-";
    latestUpdateEl.textContent = "-";
    setStatus(`Terjadi kesalahan: ${error.message}`, "error");
  } finally {
    refreshButton.disabled = false;
  }
}

refreshButton.addEventListener("click", fetchProducts);
window.addEventListener("DOMContentLoaded", fetchProducts);
