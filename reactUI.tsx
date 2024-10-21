import { useState } from "react"

// ref
function SelectableList() {
    const [selected, setSelected] = useState<number[]>([])
    return <ul>
        {[1, 2].map((e, i) =>
            <li key={i} onClick={e => click(e, i)}>{e}</li>
        )}
    </ul>

    function click(e: React.MouseEvent<HTMLElement>, v: number) {
        let result: number[]
        if (!e.shiftKey) {
            if (selected.length === 1 && selected[0] === v) result = []
            else result = [v]
        } else {
            const startEnd = [selected[0], v]
            startEnd.sort((a, b) => a > b ? 1 : -1)
            const [start, end] = startEnd
            result = []
            for (let i = start; i < end + 1; i++) {
                result.push(i)
            }
        }
        if (!result) result = []
        setSelected(result)
    }
}