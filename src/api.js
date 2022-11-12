const API_KEY = `2aeadb95cfcedee9c60c65d0a38eddd5555762a57e6777184d588aac9a1cce48`;
const tickersHandler = new Map();// tickersHandler [doge] и функции которые надо вызвать
const loadTickers = () => {
    if (tickersHandler.length == 0){
        return;
    }
    fetch(
      `https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=${
        [...tickersHandler.keys()]
        .join(",")
    }&api_key=${API_KEY}`
    ).then(result =>
        result.json()
    ).then(rawData => {
        const updatedPrices = Object.fromEntries(
            Object.entries(rawData).map(([key, value]) => [key, 1 / value])
        )
        Object.entries(updatedPrices).forEach(([currencyTickerName, newPrice]) => {
            const handlers = tickersHandler.get(currencyTickerName) ?? []; //Маленькая буква, мешает
            handlers.forEach(fn => fn(newPrice));
        });
    });
    
};
export const subscribeToTicker = (tickerName, cb) => {
    const subscribers = tickersHandler.get(tickerName) || [];
    tickersHandler.set(tickerName, [...subscribers, cb]);
}
export const unsubscribeToTicker = (tickerName) => {
    tickersHandler.delete(tickerName);
}

export const getAllTickers = () => 
    fetch(
        `https://min-api.cryptocompare.com/data/all/coinlist?summary=true`
    ).then(result => 
        result.json()
    ).then(allTickers => 
        allTickers.Data
    );

window.tickers = tickersHandler;
setInterval(loadTickers, 5000);  //Магическая цифра, я изначально думал избавляемся от него, но оказалось нет
//Логика получения обновлений шикарна, обновление, 2 самое то. Задаваться вопросом лучше
    //Получить стоимость криптовалютных пар с Апишки?
    //Получить ОБНОВЛЕНИЯ стоимости криптовалютных пар с Апишки