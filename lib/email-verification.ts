// This version doesn't use fs or other Node.js specific modules
import swot from "swot-node"

// Make this function async to handle the swot library properly
export async function isAcademicEmail(email: string) {
  try {
    // Use the swot library to check if the email is academic
    return await swot.isAcademic(email) // Returns true for valid academic domains
  } catch (error) {
    console.error("Error checking academic email:", error)
    return false
  }
}

// List of known Indian academic email domains that might not be in swot database
const indianAcademicDomains = [
  // IITs
  "iitb.ac.in", // IIT Bombay
  "iitd.ac.in", // IIT Delhi
  "iitk.ac.in", // IIT Kanpur
  "iitkgp.ac.in", // IIT Kharagpur
  "iitm.ac.in", // IIT Madras
  "iitg.ac.in", // IIT Guwahati
  "iith.ac.in", // IIT Hyderabad
  "iitbbs.ac.in", // IIT Bhubaneswar
  "iitgn.ac.in", // IIT Gandhinagar
  "iiti.ac.in", // IIT Indore
  "iitj.ac.in", // IIT Jodhpur
  "iitmandi.ac.in", // IIT Mandi
  "iitp.ac.in", // IIT Patna
  "iitpkd.ac.in", // IIT Palakkad
  "iitr.ac.in", // IIT Roorkee
  "iitdh.ac.in", // IIT Dharwad
  "iitism.ac.in", // IIT ISM Dhanbad
  "iitbhilai.ac.in", // IIT Bhilai
  "iitgoa.ac.in", // IIT Goa
  "iitjammu.ac.in", // IIT Jammu
  "iittirupati.ac.in", // IIT Tirupati
  // NITs and other colleges as before...
]

export function isIndianAcademicEmail(email: string) {
  const domain = email.split("@")[1]
  if (!domain) return false

  return indianAcademicDomains.some(
    (academicDomain) => domain === academicDomain || domain.endsWith("." + academicDomain),
  )
}

// Create a browser-safe version that doesn't rely on Node.js modules
export async function isValidAcademicEmail(email: string) {
  // First check our custom list of Indian academic domains
  if (isIndianAcademicEmail(email)) {
    return true
  }

  // Then check with swot library
  try {
    return await isAcademicEmail(email)
  } catch (error) {
    console.error("Error in swot library:", error)
    // Fallback to just our custom check if swot fails
    return isIndianAcademicEmail(email)
  }
}
