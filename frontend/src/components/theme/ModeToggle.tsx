import { MoonIcon, SunIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useTheme } from "./ThemeProvider"
import { useEffect, useState } from "react"

export function ModeToggle() {
    const [mounted, setMounted] = useState(false);
    const { setTheme, theme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, [])

    return (
        <>
            {
                mounted && <>
                    <Button 
                    variant="outline"
                    className="cursor-pointer"
                    onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
                        {theme === "light" ? <MoonIcon /> : <SunIcon />}
                    </Button>
                </>
            }
        </>
    )
}