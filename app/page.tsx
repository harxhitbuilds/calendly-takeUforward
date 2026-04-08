import Container from "@/components/global/container";
import Calender from "@/components/home/calender";
import Header from "@/components/home/header";
import SettingDialog from "@/components/home/setting-dialog";

export default function Home() {
  return (
    <Container className="relative flex min-h-screen flex-col justify-center gap-8 py-12">
      <Header />
      <Calender />
      <SettingDialog />
    </Container>
  );
}
