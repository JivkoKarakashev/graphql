const bodyEl = document.querySelector('body');

const fetchData = async () => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: 'query { greeting }'
    })
  };
  const res = await fetch('http://localhost:3000', options);
  const payload = await res.json();
  console.log('Payload:', payload);
  return payload.data.greeting;
};

const renderData = async (data) => {
  bodyEl.querySelector('.content > p').textContent = data;
};

const stopLoading = () => {
  bodyEl.querySelector('.loading').remove();
};

(async function bootstrap() {
  const data = await fetchData();
  setTimeout(() => {
    stopLoading();
    renderData(data);
  }, 2000);
})()