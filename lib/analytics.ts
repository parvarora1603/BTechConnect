import { supabaseAdmin } from "./supabase"

// Track an event for a user
export async function trackEvent(userId: string, eventType: string, eventData: any = {}) {
  try {
    await supabaseAdmin.from("analytics_events").insert({
      user_id: userId,
      event_type: eventType,
      event_data: eventData,
    })
  } catch (error) {
    console.error("Error tracking event:", error)
  }
}

// Get analytics data for a specific event type
export async function getEventAnalytics(eventType: string, timeframe = "week") {
  try {
    let timeConstraint = ""

    switch (timeframe) {
      case "day":
        timeConstraint = "created_at > now() - interval '1 day'"
        break
      case "week":
        timeConstraint = "created_at > now() - interval '7 days'"
        break
      case "month":
        timeConstraint = "created_at > now() - interval '30 days'"
        break
      default:
        timeConstraint = "created_at > now() - interval '7 days'"
    }

    const { data, error } = await supabaseAdmin
      .from("analytics_events")
      .select("*")
      .eq("event_type", eventType)
      .filter("created_at", "gt", `now() - interval '${timeframe}'`)

    if (error) throw error

    return data
  } catch (error) {
    console.error("Error getting event analytics:", error)
    return []
  }
}

// Get user growth analytics
export async function getUserGrowthAnalytics(timeframe = "week") {
  try {
    const { data, error } = await supabaseAdmin.rpc("get_user_growth", {
      timeframe_param: timeframe,
    })

    if (error) throw error

    return data
  } catch (error) {
    console.error("Error getting user growth analytics:", error)
    return []
  }
}

// Get match analytics
export async function getMatchAnalytics(timeframe = "week") {
  try {
    const { data, error } = await supabaseAdmin.rpc("get_match_analytics", {
      timeframe_param: timeframe,
    })

    if (error) throw error

    return data
  } catch (error) {
    console.error("Error getting match analytics:", error)
    return []
  }
}
