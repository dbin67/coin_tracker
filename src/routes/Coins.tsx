import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { useWebSocket } from "react-use-websocket/dist/lib/use-websocket";
import styled from "styled-components";
import { fetchCoins } from "../api";
import { Back } from "./Coin";

const Container = styled.div`
	padding: 0px 20px;
	max-width: 480px;
	margin: 0 auto;
`;

export const Header = styled.header`
	height: 15vh;
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
`;

const CoinsList = styled.ul``;

const Coin = styled.li`
	background-color: ${(props) => props.theme.boxColor};
	color: ${(props) => props.theme.textColor};
	border-radius: 15px;
	margin-bottom: 10px;
	a {
		display: flex;
		align-items: center;
		padding: 20px;
		transition: color 0.2s ease-in;
	}
	&:hover {
		a {
			color: ${(props) => props.theme.accentColor};
		}
	}
`;

export const Title = styled.h1`
	font-size: 48px;
	color: ${(props) => props.theme.accentColor};
`;

const Loader = styled.span`
	text-align: center;
	display: block;
`;

const Img = styled.img`
	width: 35px;
	height: 35px;
	margin-right: 10px;
`;

const CoinInfo = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	width: 100%;
`;

export interface ICoin {
	id: string;
	name: string;
	symbol: string;
	rank: number;
	is_new: boolean;
	is_active: boolean;
	type: string;
}

interface IminiTicker {
	[k: string]: any;
	e: string;
	E: number;
	s: string;
	c: string;
	o: string;
	h: string;
	l: string;
	v: string;
	q: string;
}

function Coins() {
	const { isLoading, data } = useQuery<ICoin[]>("allCoins", fetchCoins);
	const tickerRef = useRef(new Map<string, HTMLElement | null>());
	const { sendJsonMessage } = useWebSocket<IminiTicker[]>(
		"wss://stream.binance.com:9443/stream",
		{
			onMessage: (res) => {
				const data = JSON.parse(res?.data).data;
				const symbol = data?.s.slice(0, -4);
				if (tickerRef.current.has(symbol)) {
					tickerRef.current.get(symbol)!.innerText =
						"$" + Number(data?.p).toFixed(3);
				}
			},
		}
	);
	const Subsribe = useCallback(
		() =>
			sendJsonMessage({
				method: "SUBSCRIBE",
				params: data?.map((coin) => `${coin.symbol.toLowerCase()}usdt@trade`),
				id: 1,
			}),
		[sendJsonMessage, data]
	);

	const Unsubsribe = useCallback(
		() =>
			sendJsonMessage({
				method: "UNSUBSCRIBE",
				params: data?.map((coin) => `${coin.symbol.toLowerCase()}usdt@trade`),
				id: 1,
			}),
		[sendJsonMessage, data]
	);

	useEffect(() => {
		Subsribe();
		return Unsubsribe;
	}, [Subsribe, Unsubsribe]);

	return (
		<Container>
			<Helmet>
				<title>Cypto Currency Trakcer</title>
			</Helmet>
			<Header>
				<Title>
					<Back to="/">
						<FontAwesomeIcon icon={solid("arrow-left")} />
						<>Home</>
					</Back>
					Coin List
				</Title>
			</Header>
			{isLoading ? (
				<Loader>Loading...</Loader>
			) : (
				<CoinsList>
					{data?.map((coin) => (
						<Coin key={coin.id}>
							<Link
								to={{
									pathname: `/coins/${coin.id}`,
									state: { name: coin.name },
								}}
							>
								<Img
									src={`https://coinicons-api.vercel.app/api/icon/${coin.symbol.toLowerCase()}`}
								/>
								<CoinInfo>
									<div>
										{coin.name} ({coin.symbol})
									</div>
									<div ref={(el) => tickerRef.current.set(coin.symbol, el)}>
										-
									</div>
								</CoinInfo>
							</Link>
						</Coin>
					))}
				</CoinsList>
			)}
		</Container>
	);
}
export default Coins;
