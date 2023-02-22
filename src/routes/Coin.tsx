import { useQuery } from "react-query";
import { Helmet } from "react-helmet";
import {
	Route,
	useLocation,
	useParams,
	useRouteMatch,
	Link,
	Switch,
} from "react-router-dom";
import styled from "styled-components";
import { fetchCoinInfo, fetchCoinTickers } from "../api";
import Chart from "./Chart";
import Price from "./Price";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useWebSocket } from "react-use-websocket/dist/lib/use-websocket";

const Title = styled.h1`
	font-size: 48px;
	color: ${(props) => props.theme.accentColor};
`;

export const Loader = styled.span`
	text-align: center;
	display: block;
`;

const Container = styled.div`
	padding: 0px 20px;
	max-width: 480px;
	margin: 0 auto;
`;

const Header = styled.header`
	height: 15vh;
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
`;

const Overview = styled.div`
	display: flex;
	justify-content: space-between;
	background-color: ${(props) => props.theme.boxColor};
	padding: 10px 20px;
	border-radius: 10px;
`;
const OverviewItem = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 33%;
	span:first-child {
		font-size: 10px;
		font-weight: 400;
		text-transform: uppercase;
		margin-bottom: 5px;
	}
`;
const Description = styled.p`
	margin: 20px 0px;
	padding: 10px;
`;

export const Tabs = styled.div`
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	margin: 25px 0px;
	gap: 10px;
`;

const Tab = styled.span<{ isActive: boolean }>`
	text-align: center;
	text-transform: uppercase;
	font-size: 12px;
	font-weight: 400;
	background-color: ${(props) => props.theme.boxColor};
	border-radius: 10px;
	color: ${(props) =>
		props.isActive ? props.theme.accentColor : props.theme.textColor};
	a {
		padding: 7px 0px;
		display: block;
	}

	&:hover {
		color: ${(props) => props.theme.accentColor};
	}
`;

export const Back = styled(Link)`
	display: flex;
	flex-direction: row;
	margin: 0px 0px 15px 0px;
	font-size: 20px;
	width: 60px;
	justify-content: space-between;
	align-items: center;
	position: absolute;
	left: 0;
	bottom: 0;
`;

interface RouteParams {
	coinId: string;
}
interface RouteState {
	name: string;
}
interface InfoData {
	id: string;
	name: string;
	symbol: string;
	rank: number;
	is_new: boolean;
	is_active: boolean;
	type: string;
	description: string;
	message: string;
	open_source: boolean;
	started_at: string;
	development_status: string;
	hardware_wallet: boolean;
	proof_type: string;
	org_structure: string;
	hash_algorithm: string;
	first_data_at: string;
	last_data_at: string;
}
export interface PriceData {
	id: string;
	name: string;
	symbol: string;
	rank: number;
	circulating_supply: number;
	total_supply: number;
	max_supply: number;
	beta_value: number;
	first_data_at: string;
	last_updated: string;
	quotes: {
		USD: {
			ath_date: string;
			ath_price: number;
			market_cap: number;
			market_cap_change_24h: number;
			percent_change_1h: number;
			percent_change_1y: number;
			percent_change_6h: number;
			percent_change_7d: number;
			percent_change_12h: number;
			percent_change_15m: number;
			percent_change_24h: number;
			percent_change_30d: number;
			percent_change_30m: number;
			percent_from_price_ath: number;
			price: number;
			volume_24h: number;
			volume_24h_change_24h: number;
		};
	};
}

interface ILivePriceData {
	e: string;
	E: number;
	s: string;
	t: number;
	p: string;
	q: string;
	b: number;
	a: number;
	T: number;
	m: boolean;
	M: boolean;
}
interface ILivePrice {
	[k: string]: any;
	stream: string;
	data: ILivePriceData;
}

function Coin() {
	const { coinId } = useParams<RouteParams>();
	const { state } = useLocation<RouteState>();
	const priceMatch = useRouteMatch("/coins/:coinId/price");
	const chartMatch = useRouteMatch("/coins/:coinId/chart");
	const { isLoading: infoLoading, data: infoData } = useQuery<InfoData>(
		["info", coinId],
		() => fetchCoinInfo(coinId!)
	);
	const { isLoading: tickersLoading, data: tickersData } = useQuery<PriceData>(
		["tickers", coinId],
		() => fetchCoinTickers(coinId!)
	);

	const [livePrice, setLivePrice] = useState<number>();
	const { sendJsonMessage, lastJsonMessage, readyState } =
		useWebSocket<ILivePrice>("wss://stream.binance.com:9443/stream", {
			onMessage: (res) => {
				setLivePrice(Number(JSON.parse(res?.data).data?.p));
			},
		});

	const Subsribe = useCallback(
		() =>
			sendJsonMessage({
				method: "SUBSCRIBE",
				params: [`${coinId!.split("-")[0]}usdt@trade`],
				id: 1,
			}),
		[sendJsonMessage]
	);

	const Unsubsribe = useCallback(
		() =>
			sendJsonMessage({
				method: "UNSUBSCRIBE",
				params: [`${coinId!.split("-")[0]}usdt@trade`],
				id: 1,
			}),
		[sendJsonMessage]
	);

	useEffect(() => {
		Subsribe();
		return Unsubsribe;
	}, []);

	const loading = infoLoading || tickersLoading;
	return (
		<Container>
			<Helmet>
				<title>
					{state?.name ? state.name : loading ? "Loading..." : infoData?.name}
				</title>
			</Helmet>
			<Header>
				<Title>
					<Back to="/coins">
						<FontAwesomeIcon icon={solid("arrow-left")} />
						<>Back</>
					</Back>
					{state?.name ? state.name : loading ? "Loading..." : infoData?.name}
				</Title>
			</Header>

			{loading ? (
				<Loader>Loading...</Loader>
			) : (
				<>
					<Overview>
						<OverviewItem>
							<span>Rank:</span>
							<span>{infoData?.rank}</span>
						</OverviewItem>
						<OverviewItem>
							<span>Symbol:</span>
							<span>${infoData?.symbol}</span>
						</OverviewItem>
						<OverviewItem>
							<span>Price:</span>
							<span>
								$
								{isNaN(livePrice!)
									? Number(tickersData?.quotes.USD.price.toFixed(3))
									: livePrice}
							</span>
						</OverviewItem>
					</Overview>
					<Description>{infoData?.description}</Description>
					<Overview>
						<OverviewItem>
							<span>Total Suply:</span>
							<span>{tickersData?.total_supply}</span>
						</OverviewItem>
						<OverviewItem>
							<span>Max Supply:</span>
							<span>{tickersData?.max_supply}</span>
						</OverviewItem>
					</Overview>

					<Tabs>
						<Tab isActive={chartMatch !== null}>
							<Link to={`/coins/${coinId}/chart`}>Chart</Link>
						</Tab>
						<Tab isActive={priceMatch !== null}>
							<Link to={`/coins/${coinId}/price`}>Price</Link>
						</Tab>
					</Tabs>

					<Switch>
						<Route path={`/coins/:coinId/price`}>
							<Price coinId={coinId} livePrice={livePrice} />
						</Route>
						<Route path={`/coins/:coinId/chart`}>
							<Chart coinId={coinId} />
						</Route>
					</Switch>
				</>
			)}
		</Container>
	);
}
export default Coin;
