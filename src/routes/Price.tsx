import React from "react";
import { useQuery } from "react-query";
import { fetchCoinTickers } from "../api";
import { Loader, PriceData, Tabs } from "./Coin";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";

const PriceTab = styled.div`
	text-align: center;
	text-transform: uppercase;
	font-size: 12px;
	font-weight: 400;
	padding: 10px;
	border-radius: 10px;
	color: ${(props) => props.theme.textColor};
	display: flex;
	flex-direction: column;
	justify-contents: center;
	align-items: center;
`;

const Change = styled.div<{ isHigher: boolean }>`
	display: flex;
	justify-contents: space-between;
	align-items: center;
	font-size: 30px;
	font-weight: 400;
	padding: 10px;
	border-radius: 10px;
	color: ${(props) => (props.isHigher ? "#DF7D46" : "#3C90EB")};
`;

interface PriceProps {
	coinId: string;
	livePrice: number | undefined;
}

const Price = React.memo(function Price({ coinId, livePrice }: PriceProps) {
	const { isLoading, data } = useQuery<PriceData>(["tickers", coinId], () =>
		fetchCoinTickers(coinId!)
	);

	const change15m = isNaN(livePrice!)
		? data?.quotes.USD.percent_change_15m
		: (((data?.quotes.USD.percent_change_15m! / 100 + 1) *
				data?.quotes.USD.price!) /
				livePrice! -
				1) *
		  100;
	const change1h = isNaN(livePrice!)
		? data?.quotes.USD.percent_change_1h
		: (((data?.quotes.USD.percent_change_1h! / 100 + 1) *
				data?.quotes.USD.price!) /
				livePrice! -
				1) *
		  100;
	const change24h = isNaN(livePrice!)
		? data?.quotes.USD.percent_change_24h
		: (((data?.quotes.USD.percent_change_24h! / 100 + 1) *
				data?.quotes.USD.price!) /
				livePrice! -
				1) *
		  100;
	const change7d = isNaN(livePrice!)
		? data?.quotes.USD.percent_change_7d
		: (((data?.quotes.USD.percent_change_7d! / 100 + 1) *
				data?.quotes.USD.price!) /
				livePrice! -
				1) *
		  100;
	const change30d = isNaN(livePrice!)
		? data?.quotes.USD.percent_change_30d
		: (((data?.quotes.USD.percent_change_30d! / 100 + 1) *
				data?.quotes.USD.price!) /
				livePrice! -
				1) *
		  100;
	const change1y = isNaN(livePrice!)
		? data?.quotes.USD.percent_change_1y
		: (((data?.quotes.USD.percent_change_1y! / 100 + 1) *
				data?.quotes.USD.price!) /
				livePrice! -
				1) *
		  100;

	return (
		<>
			{isLoading ? (
				<Loader>Loading...</Loader>
			) : (
				<Tabs>
					<PriceTab>
						<p>compare to last 15m</p>
						<Change isHigher={change15m! > 0}>
							<span style={{ marginRight: "18px" }}>
								{change15m?.toFixed(3)}%
							</span>
							<FontAwesomeIcon
								icon={change15m! > 0 ? solid("up-long") : solid("down-long")}
							/>
						</Change>
					</PriceTab>
					<PriceTab>
						<p>compare to last 1h</p>
						<Change isHigher={change1h! > 0}>
							<span style={{ marginRight: "18px" }}>
								{change1h?.toFixed(3)}%
							</span>
							<FontAwesomeIcon
								icon={change1h! > 0 ? solid("up-long") : solid("down-long")}
							/>
						</Change>
					</PriceTab>
					<PriceTab>
						<p>compare to last 24h</p>
						<Change isHigher={change24h! > 0}>
							<span style={{ marginRight: "18px" }}>
								{change24h?.toFixed(3)}%
							</span>
							<FontAwesomeIcon
								icon={change24h! > 0 ? solid("up-long") : solid("down-long")}
							/>
						</Change>
					</PriceTab>
					<PriceTab>
						<p>compare to last 7d</p>
						<Change isHigher={change7d! > 0}>
							<span style={{ marginRight: "18px" }}>
								{change7d?.toFixed(3)}%
							</span>
							<FontAwesomeIcon
								icon={change7d! > 0 ? solid("up-long") : solid("down-long")}
							/>
						</Change>
					</PriceTab>
					<PriceTab>
						<p>compare to last 30d</p>
						<Change isHigher={change30d! > 0}>
							<span style={{ marginRight: "18px" }}>
								{change30d?.toFixed(3)}%
							</span>
							<FontAwesomeIcon
								icon={change30d! > 0 ? solid("up-long") : solid("down-long")}
							/>
						</Change>
					</PriceTab>
					<PriceTab>
						<p>compare to last 1y</p>
						<Change isHigher={change1y! > 0}>
							<span style={{ marginRight: "18px" }}>
								{change1y?.toFixed(3)}%
							</span>
							<FontAwesomeIcon
								icon={change1y! > 0 ? solid("up-long") : solid("down-long")}
							/>
						</Change>
					</PriceTab>
				</Tabs>
			)}
		</>
	);
});

export default Price;
