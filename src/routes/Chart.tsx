import { useQuery } from "react-query";
import { fetchCoinHistory } from "../api";
import React from "react";
import ApexChart from "react-apexcharts";
import { useTheme } from "styled-components";

interface IHistorical {
	time_open: number;
	time_close: number;
	open: string;
	high: string;
	low: string;
	close: string;
	volume: string;
	market_cap: number;
	error?: string;
}
interface ChartProps {
	coinId: string;
}
const Chart = React.memo(function Chart({ coinId }: ChartProps) {
	const theme = useTheme();
	const { isLoading, data } = useQuery<IHistorical[]>(["ohlcv", coinId], () =>
		fetchCoinHistory(coinId)
	);
	let validData = data ?? [];
	if ("error" in validData) {
		validData = [];
	}

	return (
		<div>
			{isLoading ? (
				"Loading chart..."
			) : (
				<ApexChart
					type="candlestick"
					series={[
						{
							data: validData.map((price) => {
								return price.error
									? []
									: [
											price.time_close,
											Number(price.open),
											Number(price.high),
											Number(price.low),
											Number(price.close),
									  ];
							}),
						},
					]}
					options={{
						noData: {
							text: "차트 데이터가 없습니다.",
							align: "center",
							verticalAlign: "middle",
							offsetX: 0,
							offsetY: 0,
							style: {
								color: theme.textColor,
								fontSize: "16px",
							},
						},
						theme: {
							mode: "dark",
						},
						chart: {
							type: "candlestick",
							height: 350,
							width: 500,
							toolbar: {
								show: false,
							},
							background: "transparent",
						},
						stroke: {
							curve: "smooth",
							width: 2,
						},
						yaxis: {
							show: false,
						},
						xaxis: {
							categories: validData.map((price) => price.time_close),
							type: "datetime",
							axisTicks: {
								show: false,
							},
							axisBorder: {
								show: false,
							},
							labels: {
								show: false,
							},
						},
						grid: {
							show: false,
						},
						plotOptions: {
							candlestick: {
								colors: {
									upward: "#DF7D46",
									downward: "#3C90EB",
								},
							},
						},
					}}
				/>
			)}
		</div>
	);
});

export default Chart;
