import Spacing from "../spacing/spacing"

export default function LayoutVerticalSpacing(p: { children: React.ReactNode }) {
    return (
        <Spacing notLeft notRight autoScale="xl" {...p}>
            {p.children}
        </Spacing>
    )
}
