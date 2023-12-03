"use client"

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import ButtonLocal from '../buttons/button'
import Spacing from '../spacing/spacing'
import { Cog6ToothIcon, CurrencyDollarIcon, Square3Stack3DIcon, BookOpenIcon, InformationCircleIcon, BoltIcon, WalletIcon, QueueListIcon, ChartPieIcon } from '@heroicons/react/24/solid'
import { onEvent } from 'utilities'
import { APP_EVENTS } from '@/const/app-events'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'

export default function Sidebar() {
    const pathname = usePathname()
    const [active, setActive] = useState(true)
    const [collapsed, collapsedSet] = useState(false)
    const [preventClosingSidebar, setPreventClosingSidebar] = useState(false)

    const openSideBar = () => {
        setActive(true)
    }

    const closeSideBar = () => {
        if (preventClosingSidebar) return
        setActive(false)
    }
    onEvent(APP_EVENTS.OPEN_SIDEBAR, openSideBar)
    onEvent(APP_EVENTS.CLOSE_SIDEBAR, closeSideBar)

    function preventClosingSidebarThen(callback?: () => {}) {
        setPreventClosingSidebar(true)
        callback?.()
        setTimeout(() => {
            setPreventClosingSidebar(false)
        }, 50)
    }

    function toggleCollapse() {
        collapsedSet((c) => !c)
    }

    return (
        <div
            onClick={closeSideBar}
            data-active={active}
            data-collapsed={collapsed}
            className="flex group fixed -translate-x-full data-[active=true]:translate-x-0 sm:translate-x-0 top-0 bottom-0 left-0 right-0 bg-black/25 sm:bg-transparent w-full sm:sticky sm:bottom-[unset] sm:w-16 lg:w-64 lg:data-[collapsed=true]:w-16 h-screen z-10 border-r border-border-dim dark:border-border-dim-dark font-tektur"
        >
            <div
                onClick={(e) => {
                    preventClosingSidebarThen()
                    e.stopPropagation()
                }}
                className="flex w-64 max-w-[90%] sm:max-w-none sm:w-full h-full -translate-x-full group-data-[active=true]:translate-x-0 transition-transform sm:transition-none sm:translate-x-0"
            >
                <div className="flex w-full bg-floating dark:bg-floating-dark">
                    <div className="flex flex-col w-full relative">
                        <div className={`flex sm:hidden lg:flex lg:group-data-[collapsed=true]:hidden w-full relative my-2`}>
                            <Spacing autoScale='md' notTop notBottom>
                                <ButtonLocal onClick={closeSideBar} className={`group/logo text-sm font-medium`} classNameLink='!justify-start' type='ghost' large roundedFull href="/" icon={<div className="flex justify-center items-center relative w-full h-full group-hover/logo:invert dark:filter dark:invert dark:group-hover/logo:invert-0 transition-all">
                                    <div className='flex justify-center items-center w-[200%] h-full absolute'>
                                        <img src="/icons/logo/logo-2x1.png" className="flex w-full h-full" alt="Strategix Money logo" />
                                    </div>
                                </div>} label={<div className='ml-2'>
                                    <div className="flex items-center relative p-0 font-tektur text-lg font-medium leading-none tracking-tighter">
                                        Strategix<div className="inline font-thin opacity-75 ml-1">Money</div>
                                        <div className='absolute left-full font-sans font-bold tracking-normal text-xs leading-none p-0.5 px-1 rounded-full bg-primary dark:bg-primary-dark text-primary-foreground dark:text-primary-foreground-dark scale-75'>BETA</div>
                                    </div>
                                </div>} />
                            </Spacing>
                        </div>
                        <div className={`hidden sm:flex lg:hidden lg:group-data-[collapsed=true]:flex w-full relative my-2`}>
                            <Spacing autoScale='base' notTop notBottom>
                                <div className='flex w-full aspect-square'>
                                    <ButtonLocal onClick={closeSideBar} className={`group/logo !justify-start text-sm font-medium`} type='ghost' large roundedFull href="/" icon={<div className="flex justify-center items-center relative w-full h-full group-hover/logo:invert dark:filter dark:invert dark:group-hover/logo:invert-0 transition-all">
                                        <div className='flex justify-center items-center w-[200%] h-full absolute'>
                                            <img src="/icons/logo/logo-2x1.png" className="flex w-full h-full" alt="Strategix Money logo" />
                                        </div>
                                    </div>} />
                                </div>
                            </Spacing>
                        </div>
                        <Spacing notLeft notRight autoScale='lg' fullHeight>
                            <div className="flex flex-col w-full h-full overflow-auto">
                                {[
                                    { pathname: '/dashboard', active: pathname == '/dashboard', label: 'Dashboard', icon: Square3Stack3DIcon },
                                    { pathname: '/strategies', active: pathname == '/strategies', label: 'Strategies', icon: ChartPieIcon },
                                    { pathname: '/bots', active: pathname == '/bots', label: 'Trading bots', icon: BoltIcon },
                                    { pathname: '/wallet', active: pathname == '/wallet', label: 'Wallet', icon: WalletIcon },
                                    { pathname: '/transactions', active: pathname == '/transactions', label: 'Transactions', icon: QueueListIcon },
                                    { pathname: '/earn', active: pathname == '/earn', label: 'Earn', icon: CurrencyDollarIcon },
                                    { pathname: '/settings', active: pathname?.startsWith('/settings'), label: 'Settings', icon: Cog6ToothIcon },
                                    {
                                        pathname: '/',
                                        active: pathname?.startsWith('/?') || pathname == '/',
                                        searchQuery: '?no_redirect=true',
                                        label: 'Main website',
                                        icon: BookOpenIcon,
                                        marginTopAuto: true
                                    },
                                    { pathname: '/support', active: pathname == '/support', label: 'Support', icon: InformationCircleIcon }
                                ].map((link) => {
                                    const currentPath = link.active ?? false
                                    return <div key={link.pathname} className={`flex w-full relative ${link.marginTopAuto ? 'mt-auto' : 'mt-1'} mb-1`}>
                                        <div className={`flex sm:hidden lg:flex lg:group-data-[collapsed=true]:hidden items-center w-full`}>
                                            <Spacing autoScale='md' notTop notBottom>
                                                <ButtonLocal onClick={closeSideBar} className={`!justify-start ${currentPath ? 'opacity-75' : 'opacity-50'} text-sm font-medium`} classNameLink={`!justify-start`} type='ghost' large roundedFull href={link.pathname + (link.searchQuery ?? '')} icon={link.icon ? <link.icon /> : null} label={<div className='ml-2'>{link.label}</div>} />
                                            </Spacing>
                                            <div className={`${currentPath ? 'flex' : 'hidden'} absolute right-0 w-1.5 h-3/4 rounded-l-lg bg-primary dark:bg-primary-dark`} />
                                        </div>
                                        <div className={`hidden sm:flex lg:hidden lg:group-data-[collapsed=true]:flex items-center w-full`}>
                                            <Spacing autoScale='base' notTop notBottom>
                                                <div className='flex w-full aspect-square'>
                                                    <ButtonLocal onClick={closeSideBar} className={`${currentPath ? 'opacity-75' : 'opacity-50'} text-sm font-medium`} type='ghost' large roundedFull href={link.pathname + (link.searchQuery ?? '')} icon={link.icon ? <link.icon /> : null} />
                                                </div>
                                            </Spacing>
                                            <div className={`${currentPath ? 'flex' : 'hidden'} absolute right-0 w-1 h-3/4 rounded-l-lg bg-primary dark:bg-primary-dark`} />
                                        </div>
                                    </div>
                                })}
                            </div>
                        </Spacing>
                        <div onClick={toggleCollapse} className='hidden lg:flex justify-center items-center absolute bottom-1/4 right-0 w-auto h-auto p-0.5 py-2.5 bg-floating dark:bg-floating-dark border border-r-0 border-border dark:border-border-dark rounded-l-lg opacity-50 hover:opacity-100'>
                            {collapsed ?
                                <ChevronRightIcon className='flex w-4 h-4' /> :
                                <ChevronLeftIcon className='flex w-4 h-4' />
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
