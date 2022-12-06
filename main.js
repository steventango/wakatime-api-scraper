async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function scrape_range(start, end) {
  const base_endpoint = `https://wakatime.com/api/v1/users/current/summaries`
  const endpoint = `${base_endpoint}?start=${start}&end=${end}`
  const response = await fetch(endpoint)
  const blob = await response.blob()
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = `wakatime-summaries-${start}-${end}.json`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
}

async function scrape(start, end) {
  const promises = [];
  for (let year = start; year <= end; ++year) {
    promises.push(scrape_range(`${year}-01-01`, `${year}-06-30`));
    await sleep(1000);
    promises.push(scrape_range(`${year}-07-01`, `${year}-12-31`));
    await sleep(1000);
  }
  await Promise.all(promises);
}

await scrape(2016, 2021);
