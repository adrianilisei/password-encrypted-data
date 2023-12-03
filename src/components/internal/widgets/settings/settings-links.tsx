import type { SettingsSection } from "@/pages/settings/settings-page"
import Button from "../../buttons/button"
import { CommandLineIcon, LockClosedIcon, UserCircleIcon } from "@heroicons/react/20/solid"

export default function SettingsLinksWidget(p: { activeSection?: SettingsSection }) {
    return (
        <div className="flex flex-col w-full gap-2 opacity-75">
            <Button href="/settings/account" type={p.activeSection == "account" ? "solid" : "outlined"} roundedFull icon={<UserCircleIcon />} label="Account" />
            <Button href="/settings/security" type={p.activeSection == "security" ? "solid" : "outlined"} roundedFull icon={<LockClosedIcon />} label="Security" />
            <Button href="/settings/trading" type={p.activeSection == "trading" ? "solid" : "outlined"} roundedFull icon={<CommandLineIcon />} label="Trading" />
        </div>
    )
}
