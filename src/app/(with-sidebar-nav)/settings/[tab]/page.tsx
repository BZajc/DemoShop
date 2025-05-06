import { notFound } from "next/navigation";
import SettingsTabs from "@/app/components/settings/SettingsTabs";
import SettingsPrivacyWrapper from "@/app/components/settings/SettingsPrivacyWrapper";
import SettingsCommunityWrapper from "@/app/components/settings/SettingsCommunityWrapper";
import SettingsPostsWrapper from "@/app/components/settings/SettingsPostWrapper";

type SettingsTabPageProps = {
  params: Promise<{ tab: string }>;
};

export default async function SettingsTabPage({ params }: SettingsTabPageProps) {
  const { tab } = await params;

  return (
    <div className="mt-[4rem] md:mt-0 p-6 animate-fade-in">
      <SettingsTabs />

      <div className="mt-6">
        {(() => {
          switch (tab) {
            case "privacy":
              return <SettingsPrivacyWrapper />;
            case "community":
              return <SettingsCommunityWrapper />;
            case "posts":
              return <SettingsPostsWrapper />;
            default:
              notFound();
          }
        })()}
      </div>
    </div>
  );
}
