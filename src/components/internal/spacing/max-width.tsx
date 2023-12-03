export default function MaxWidth(p: { disabled?: boolean, children: React.ReactNode }) {
    return (

        <div className={`flex w-full ${p.disabled ? '' : 'max-w-7xl'}`} >
            {p.children}
        </div>
    )
}
