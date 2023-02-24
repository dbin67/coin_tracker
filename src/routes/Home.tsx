import { useQuery } from "react-query";
import { fetchAllCoinTickers } from "../api";
import { Loader, PriceData } from "./Coin";
import { Header, Title } from "./Coins";
import ApexChart from "react-apexcharts";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Treemap = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	color: black;
`;

const TreemapTitle = styled.span`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
`;

const Button = styled(Link)`
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 10px;
	font-size: 30px;
	margin-bottom: 40px;
	&:hover {
		color: ${(props) => props.theme.accentColor};
	}
`;

export function Home() {
	const { isLoading, data } = useQuery<PriceData[]>(["tickers"], () =>
		fetchAllCoinTickers()
	);
	return (
		<>
			<Header>
				<Title>Coin Tracker</Title>
			</Header>
			{isLoading ? (
				<Loader>Loading...</Loader>
			) : (
				<>
					<Button to={`/coins`}>Go check Coin List</Button>
					<TreemapTitle>Coin Market Caps</TreemapTitle>
					<Treemap>
						<div style={{ width: "80%" }}>
							<ApexChart
								type="treemap"
								options={{
									chart: { height: 150, type: "treemap" },
									legend: {
										show: true,
									},
								}}
								series={[
									{
										data: data?.map((coin) => {
											return { x: coin.name, y: coin.quotes.USD.market_cap };
										}),
									},
								]}
							/>
						</div>
					</Treemap>
				</>
			)}{" "}
		</>
	);
}
