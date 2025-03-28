import UniqueOpenRateChart from "@/components/response_rate_chart";
import ResponseRateCard from "../../components/response_rate_card";

export default function ResponseRates() {
	return (
		<main className="p-8">
			<h1>Response Rates Page</h1>
			<ResponseRateCard />
			<UniqueOpenRateChart />
		</main>
	);
}
