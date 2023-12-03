export const THEME_COLORS = {
    surface: 'rgb(255, 255, 255)',
    surface_dark: 'rgb(9, 8, 8)',
    on_surface: 'rgb(0, 0, 0)',
    on_surface_dark: 'rgb(255, 255, 255)',
    floating: 'rgb(248, 248, 248)',
    floating_dark: 'rgb(26, 26, 26)',
    on_floating: 'rgb(0, 0, 0)',
    on_floating_dark: 'rgb(255, 255, 255)',
    primary: 'rgb(29, 81, 254)',
    primary_dark: 'rgb(29, 81, 254)',
    on_primary: 'rgb(255, 255, 255)',
    on_primary_dark: 'rgb(255, 255, 255)',
    secondary: 'rgb(84, 86, 67)',
    secondary_dark: 'rgb(144, 149, 128)',
    on_secondary: 'rgb(255, 255, 255)',
    on_secondary_dark: 'rgb(255, 255, 255)',
    border: 'rgb(223, 225, 228)',
    border_dark: 'rgb(79, 65, 68)',
    border_dim: 'rgb(239, 241, 244)',
    border_dim_dark: 'rgb(63, 49, 52)',
    profits: "rgb(116, 204, 0)",
    profits_dark: "rgb(210, 255, 150)",
    on_profits: "rgb(0, 0, 0)",
    on_profits_dark: "rgb(0, 0, 0)",
    losses: "rgb(204, 3, 0)",
    losses_dark: "rgb(255, 102, 99)",
    on_losses: "rgb(255, 255, 255)",
    on_losses_dark: "rgb(255, 255, 255)"
}

export const rgbWithOpacity = (rgbColor: string, opacity = 1) => {
    if (!rgbColor.includes('rgb(') || !rgbColor.includes(')')) return rgbColor
    return rgbColor.replace('rgb(', 'rgba(').replace(')', `, ${opacity})`)
}