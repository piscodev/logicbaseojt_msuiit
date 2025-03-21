'use client'

import React, { useEffect, useState } from "react";
import ShiftHistoryTable from "@/app/components/attendance/ShiftHistoryTable";
import { useUserStore } from "@/stores/userStore";

export default function App()
{
  const user = useUserStore((state) => state.user)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])

  const fetchData = async() =>
  {
    if (!user)
      return

    setLoading(true)
    try
    {
      const response = await fetch("/api/attendance/shiftHistory",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: user.first_name }),
      })

      if (!response.ok)
        throw new Error("Failed to fetch data")

      const result = await response.json()
      setData(result.data || [])
    } catch (error) {
      console.error("Error getting Cashier data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() =>
  {
    fetchData()
  }, [user])

  return ( <ShiftHistoryTable data={data} isLoading={loading} /> )
}