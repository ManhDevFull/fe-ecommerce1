'use client'
import Filter from "@/components/templates/filter/filter";
import ShowItems from "@/components/templates/showItems/showItems";
import { Suspense, useState } from "react";

export default function AllProduct(){
    const [state, setState] = useState<{
        total?: number
        type: boolean
    }>({
        type : true
    })
    console.log('type state: ', state.type);
    return (
        <div>
            <ShowItems
                type={state.type}
                total={state.total ?? 0}
                onSetType={(newType: boolean) =>
                    setState((ps) => ({ ...ps, type: newType }))
                }
            />
            <Suspense fallback={<div className="py-10 text-center text-gray-500">Loading filters...</div>}>
                <Filter
                    type={state.type}
                    onSetTotal={(newtotal: number) =>
                        setState((prev) => ({ ...prev, total: newtotal }))
                    }
                />
            </Suspense>
        </div>
    )
}
