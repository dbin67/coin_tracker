import { PriceData } from "./routes/Coin";
const BASE_URL = `https://api.coinpaprika.com/v1`;

export function fetchCoinInfo(coinId: string) {
	return fetch(`${BASE_URL}/coins/${coinId}`).then((response) =>
		response.json()
	);
}

export function fetchCoinTickers(coinId: string) {
	return fetch(`${BASE_URL}/tickers/${coinId}`).then((response) =>
		response.json()
	);
}

export function fetchAllCoinTickers() {
	return fetch(`${BASE_URL}/tickers`)
		.then((response) => response.json())
		.then((data: PriceData[]) => data.slice(0, 100));
}

export function fetchCoinHistory(coinId: string) {
	return fetch(
		`https://ohlcv-api.nomadcoders.workers.dev?coinId=${coinId}`
	).then((response) => response.json());
}
