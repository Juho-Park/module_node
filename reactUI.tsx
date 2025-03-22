// import { useState } from "react"

// // ref
// function SelectableList() {
//     const [selected, setSelected] = useState<number[]>([])
//     return <ul>
//         {[1, 2].map((e, i) =>
//             <li key={i} onClick={e => click(e, i)}>{e}</li>
//         )}
//     </ul>

//     function click(e: React.MouseEvent<HTMLElement>, v: number) {
//         let result: number[]
//         if (!e.shiftKey) {
//             if (selected.length === 1 && selected[0] === v) result = []
//             else result = [v]
//         } else {
//             const startEnd = [selected[0], v]
//             startEnd.sort((a, b) => a > b ? 1 : -1)
//             const [start, end] = startEnd
//             result = []
//             for (let i = start; i < end + 1; i++) {
//                 result.push(i)
//             }
//         }
//         if (!result) result = []
//         setSelected(result)
//     }
// }


/** from chestnut
function DepartmentOrdering({ data, done }
    : { data: Admin.Department[], done: () => void }) {
    const [depts, setDepts] = useState<Admin.Department[]>(data)
    const [selected, setSelected] = useState<number[]>([])
    const dragOverItem = useRef<number | null>(null);
    const dragEnter = (idx: number) => {
        dragOverItem.current = idx;
    };
    const dragEnd = () => {
        if (selected.length < 1 || dragOverItem.current === null) return
        const dragOverIndex = dragOverItem.current
        dragOverItem.current = null
        selected.sort((a, b) => a > b ? 1 : -1)
        const firstIndex = selected[0]
        const lastIndex = selected.at(-1) ?? firstIndex
        const copyListItems = [...depts];
        const dragItemConotent = copyListItems.slice(firstIndex, lastIndex + 1);
        copyListItems.splice(firstIndex, selected.length);
        const insertAt = dragOverIndex > firstIndex
            ? dragOverIndex - selected.length + 1 // 선택 항목이 아래로 이동할 때
            : dragOverIndex // 위로
        copyListItems.splice(insertAt, 0, ...dragItemConotent);
        const result: number[] = []
        for (let i = 0; i < selected.length; i++) {
            result.push(insertAt + i)
        }
        setSelected(result)
        setDepts(copyListItems);
    }
    return <Stack>
        <Stack direction='row'>
            <Button variant='contained' onClick={submit}>순서 저장</Button>
        </Stack>
        {depts.map((d, i) => <ListItem key={i}
            draggable
            onClick={e => click(e, i)}
            onDragOver={e => e.preventDefault()}
            onDragStart={() => dragStart(i)}
            onDragEnter={() => dragEnter(i)}
            onDragEnd={dragEnd}
            style={{ backgroundColor: selected.includes(i) ? 'lightgray' : undefined }}>
            <Stack direction='row' alignItems='center' spacing={1}>
                <div>{i + 1}</div>
                <div>{d.field}</div>
                <div>{d.college}</div>
                <div>{d.name}</div>
            </Stack>
        </ListItem>)}
    </Stack>
    function dragStart(v: number) {
        if (selected.includes(v)) return
        else setSelected([v])
    }
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
    async function submit() {
        await action.updateDeptSort(depts.map((d, i) => [d.idx, i + 1]))
        done()
    }
}
 */