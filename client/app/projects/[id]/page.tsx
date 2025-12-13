"use client"
import React, { useState } from "react"
import { useParams } from "next/navigation"
import ProjectHeader from "../ProjectHeader"
import BoardView from "../BoardView"
import ListView from "../ListView"
import Timeline from "../TimeLineView"
import Table from "../Table"
import ModalNewTask from "@/app/(components)/ModalNewTask"

const Project = () => {
    const params = useParams()
    const id = params?.id as string | undefined

    const [activeTab, setActiveTab] = useState("Board")
    const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false)

    if (!id) {
        return <div>Loading...</div>
    }

    return (
        <div>
            {/* Modal new task  */}
            <ModalNewTask id={id}  isOpen={isModalNewTaskOpen} onClose={() => setIsModalNewTaskOpen(false)} />

            <ProjectHeader activeTab={activeTab} setActiveTab={setActiveTab} id={id}/>

            {activeTab === "Board" && (
                <BoardView id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
            )}

            {activeTab === "List" && (
                <ListView id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
            )}

            {activeTab === "Timeline" && (
                <Timeline id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
            )}

            {activeTab === "Table" && (
                <Table id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
            )}


        </div>
    )
}

export default Project;