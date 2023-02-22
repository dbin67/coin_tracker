import { BrowserRouter, Switch, Route } from "react-router-dom";
import Coin from "./routes/Coin";
import Coins from "./routes/Coins";
import { Home } from "./routes/Home";

function Router() {
	return (
		<BrowserRouter>
			<Switch>
				<Route path="/coins/:coinId">
					<Coin />
				</Route>
				<Route path="/coins">
					<Coins />
				</Route>
				<Route path="/">
					<Home />
				</Route>
			</Switch>
		</BrowserRouter>
	);
}
export default Router;
