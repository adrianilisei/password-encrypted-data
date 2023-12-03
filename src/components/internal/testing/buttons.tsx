'use client'

import Button from "@/components/internal/buttons/button"
import { LinkIcon, PlayIcon } from "@heroicons/react/20/solid"

export default function TestingButtons() {

    return (
        <>
            <div className="flex w-full gap-2">
                {[1, 2, 3].map((i) => {
                    return <div key={i} className={`flex flex-auto flex-col gap-2 ${i == 3 ? "w-1/2" : i == 2 ? "w-1/4" : "w-1/6"}`}>
                        {[1, 2, 3].map((i) => {
                            return <div key={i}>
                                <div className="flex">
                                    <div className="flex gap-2">
                                        <Button small={i == 1} large={i == 3} type="solid" icon={<LinkIcon />} />
                                        <Button small={i == 1} large={i == 3} type="soft" icon={<LinkIcon />} />
                                        <Button small={i == 1} large={i == 3} type="outlined" icon={<LinkIcon />} />
                                        <Button small={i == 1} large={i == 3} type="ghost" icon={<LinkIcon />} />
                                    </div>
                                </div>
                                <Button small={i == 1} large={i == 3} type="solid" icon={<LinkIcon />} />
                                <Button small={i == 1} large={i == 3} type="soft" icon={<LinkIcon />} />
                                <Button small={i == 1} large={i == 3} type="outlined" icon={<LinkIcon />} />
                                <Button small={i == 1} large={i == 3} type="ghost" icon={<LinkIcon />} />
                                <Button small={i == 1} large={i == 3} theme="primary" type="solid" icon={<LinkIcon />} />
                                <Button small={i == 1} large={i == 3} theme="primary" type="soft" icon={<LinkIcon />} />
                                <Button small={i == 1} large={i == 3} theme="primary" type="outlined" icon={<LinkIcon />} />
                                <Button small={i == 1} large={i == 3} theme="primary" type="ghost" icon={<LinkIcon />} />
                                <Button small={i == 1} large={i == 3} theme="secondary" type="solid" icon={<LinkIcon />} />
                                <Button small={i == 1} large={i == 3} theme="secondary" type="soft" icon={<LinkIcon />} />
                                <Button small={i == 1} large={i == 3} theme="secondary" type="outlined" icon={<LinkIcon />} />
                                <Button small={i == 1} large={i == 3} theme="secondary" type="ghost" icon={<LinkIcon />} />

                                <div className="flex">
                                    <div className="flex gap-2">
                                        <Button small={i == 1} large={i == 3} type="solid" label="Activate strategy" />
                                        <Button small={i == 1} large={i == 3} type="soft" label="Activate strategy" />
                                        <Button small={i == 1} large={i == 3} type="outlined" label="Activate strategy" />
                                        <Button small={i == 1} large={i == 3} type="ghost" label="Activate strategy" />
                                    </div>
                                </div>
                                <Button small={i == 1} large={i == 3} type="solid" label="Activate strategy" />
                                <Button small={i == 1} large={i == 3} type="soft" label="Activate strategy" />
                                <Button small={i == 1} large={i == 3} type="outlined" label="Activate strategy" />
                                <Button small={i == 1} large={i == 3} type="ghost" label="Activate strategy" />
                                <Button small={i == 1} large={i == 3} theme="primary" type="solid" label="Activate strategy" />
                                <Button small={i == 1} large={i == 3} theme="primary" type="soft" label="Activate strategy" />
                                <Button small={i == 1} large={i == 3} theme="primary" type="outlined" label="Activate strategy" />
                                <Button small={i == 1} large={i == 3} theme="primary" type="ghost" label="Activate strategy" />
                                <Button small={i == 1} large={i == 3} theme="secondary" type="solid" label="Activate strategy" />
                                <Button small={i == 1} large={i == 3} theme="secondary" type="soft" label="Activate strategy" />
                                <Button small={i == 1} large={i == 3} theme="secondary" type="outlined" label="Activate strategy" />
                                <Button small={i == 1} large={i == 3} theme="secondary" type="ghost" label="Activate strategy" />

                                <div className="flex">
                                    <div className="flex">
                                        <Button small={i == 1} large={i == 3} type="solid" icon={<PlayIcon />} label="Activate strategy" />
                                    </div>
                                </div>
                                <Button small={i == 1} large={i == 3} type="solid" icon={<PlayIcon />} label="Activate strategy" />
                                <Button small={i == 1} large={i == 3} type="soft" icon={<PlayIcon />} label="Activate strategy" />
                                <Button small={i == 1} large={i == 3} type="outlined" icon={<PlayIcon />} label="Activate strategy" />
                                <Button small={i == 1} large={i == 3} type="ghost" icon={<PlayIcon />} label="Activate strategy" />
                                <Button small={i == 1} large={i == 3} theme="primary" type="solid" icon={<PlayIcon />} label="Activate strategy" />
                                <Button small={i == 1} large={i == 3} theme="primary" type="soft" icon={<PlayIcon />} label="Activate strategy" />
                                <Button small={i == 1} large={i == 3} theme="primary" type="outlined" icon={<PlayIcon />} label="Activate strategy" />
                                <Button small={i == 1} large={i == 3} theme="primary" type="ghost" icon={<PlayIcon />} label="Activate strategy" />
                                <Button small={i == 1} large={i == 3} theme="secondary" type="solid" icon={<PlayIcon />} label="Activate strategy" />
                                <Button small={i == 1} large={i == 3} theme="secondary" type="soft" icon={<PlayIcon />} label="Activate strategy" />
                                <Button small={i == 1} large={i == 3} theme="secondary" type="outlined" icon={<PlayIcon />} label="Activate strategy" />
                                <Button small={i == 1} large={i == 3} theme="secondary" type="ghost" icon={<PlayIcon />} label="Activate strategy" />
                            </div>
                        })}
                    </div>
                })}
            </div>
        </>
    )
}