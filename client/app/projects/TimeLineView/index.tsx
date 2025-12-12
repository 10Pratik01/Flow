import { useAppSelector } from '@/app/redux'
import { useGetTasksQuery } from '@/state/api'
import {DisplayOption, ViewMode} from "@wamra/gantt-task-react"
import React, { useMemo, useState } from 'react'

type Props = {
     id: string
    setIsModalNewTaskOpen: (isOpen: boolean) => void
}

type TaskTypeItems = "task" | "milestone" | "project"; 

const TimeLine = ({id, setIsModalNewTaskOpen}: Props) => {

    const idDarkMode = useAppSelector((state) => state.global.isDarkMode)
    const {data: tasks, error, isLoading } = useGetTasksQuery({projectId : Number(id)})

    const [displayOptions, setDisplayOptions] = useState<DisplayOption>({
        viewMode: ViewMode.Month, 
        // locale: "en-US"
    })

    const ganttTask = useMemo(() => {
        return (
            tasks?.map((task) => (
               {
                 start: new Date(task.startDate as string),
                 end: new Date(task.dueDate as string), 
                 name: task.title,
                 id: `Task-${task.id}`, 
                 type: 'task' as 'TaskType', 
                 progress: task.points ?  ( task.points / 10) * 100 : 0,
                 isDisabled: false
               })) || [] 
        )
    }, [tasks]);

    if (isLoading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading tasks...</div>
      </div>
    )
  if (error)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-destructive">Error loading tasks</div>
      </div>
    )

    return (
    <div>TimeLIne</div>
  )
}

export default TimeLine