"use client"

import { useState } from "react"
import { Navbar } from "./navbar"
import { Sidebar } from "./sidebar"
import { DashboardContent } from "./dashboard-content"
import { ScheduleView } from "./schedule-view"
import { TeachersView } from "./teachers-view"
import { CoursesView } from "./courses-view"
import { ClassroomsView } from "./classrooms-view"
import { ReportsView } from "./reports-view"

export type ViewType = "dashboard" | "schedule" | "teachers" | "courses" | "classrooms" | "reports"

export function Dashboard() {
  const [currentView, setCurrentView] = useState<ViewType>("dashboard")

  const renderContent = () => {
    switch (currentView) {
      case "dashboard":
        return <DashboardContent />
      case "schedule":
        return <ScheduleView />
      case "teachers":
        return <TeachersView />
      case "courses":
        return <CoursesView />
      case "classrooms":
        return <ClassroomsView />
      case "reports":
        return <ReportsView />
      default:
        return <DashboardContent />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar currentView={currentView} onViewChange={setCurrentView} />
        <main className="flex-1 p-6">{renderContent()}</main>
      </div>
    </div>
  )
}
