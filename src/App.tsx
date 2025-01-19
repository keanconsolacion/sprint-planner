import "./App.css";
import PageContainer from "./components/PageContainer";
import NavigationBar from "./components/NavigationBar";
import { ThemeProvider } from "./components/ThemeProvider";
import useSocket from "./hooks/useSocket";
import { Toaster } from "@/components/ui/toaster";
import Footer from "./components/Footer";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import { Suspense } from "react";
import { Loader } from "lucide-react";
import Lobby from "./modules/Lobby";

function App() {
	useSocket();

	return (
		<Suspense fallback={<Loader />}>
			<I18nextProvider i18n={i18n}>
				<ThemeProvider>
					<NavigationBar />
					<PageContainer>
						<Lobby />
					</PageContainer>
					<Footer />
					<Toaster />
				</ThemeProvider>
			</I18nextProvider>
		</Suspense>
	);
}

export default App;
