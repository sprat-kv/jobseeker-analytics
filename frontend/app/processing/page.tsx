import Spinner from "../../components/spinner";

const ProcessingPage = () => {
	return (
		<div className="flex flex-col items-center justify-center h-screen">
			<h1 className="text-3xl font-semibold mb-4">We are processing your job!</h1>
			<Spinner />
			<p className="text-lg mt-4">
				Your job is being processed. You will be redirected to the download page once it&#39;s ready.
			</p>
		</div>
	);
};

export default ProcessingPage;
