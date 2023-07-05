import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Tournament } from "@prisma/client";

interface Params {
  params: {
    id: string;
  };
}

export async function GET(request: Request, { params }: Params) {
  try {
    // Get the route params
    const tournamentId = params.id;

    // Check if the user has access to the tournament
    if (!(await verifyCurrentUserHasAccessToTournament(tournamentId))) {
      return new Response("Unauthorized access", { status: 500 });
    }

    // Get the tournament data
    const tournament = await prisma.tournament.findUnique({
      where: {
        id: tournamentId,
      },
      include: {
        discipline: true,
      },
    });

    return NextResponse.json(tournament);
  } catch (error) {
    return new Response("Error retrieving tournament", { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    // Get the request body
    const {
      id,
      name,
      fullName,
      scheduledDateStart,
      scheduledDateEnd,
      timezone,
      size,
      online,
      location,
      country,
      enableRegistration,
      registrationOpeningDateTime,
      registrationClosingDateTime,
      organizer,
      contact,
      discord,
      website,
      description,
      rules,
      prize,
      registrationNotification,
      registrationAutoAccept,
      registrationRequestMsg,
      registrationAcceptMsg,
      registrationRefusalMsg,
      registrationTerms,
      registrationTermsUrl,
      registrationPermanentTeam,
      enableCheckIn,
      checkInParticipant,
      checkInStartDateTime,
      checkInEndDateTime,
      teamMinSize,
      teamMaxSize,
    } = await request.json();

    // Update tournament settings
    const updatedTournament: Tournament = await prisma.tournament.update({
      where: {
        id: id,
      },
      data: {
        name,
        full_name: fullName,
        organization: organizer,
        size,
        online,
        location,
        country,
        scheduled_date_start: scheduledDateStart,
        scheduled_date_end: scheduledDateEnd,
        timezone,
        description,
        prize,
        rules,
        contact,
        discord,
        website,
        registration_enabled: enableRegistration,
        registration_opening_datetime: registrationOpeningDateTime,
        registration_closing_datetime: registrationClosingDateTime,
        registration_participant_email_enabled: registrationAutoAccept,
        registration_permanent_team_mandatory: registrationPermanentTeam,
        registration_notification_enabled: registrationNotification,
        registration_request_message: registrationRequestMsg,
        registration_acceptance_message: registrationAcceptMsg,
        registration_refusal_message: registrationRefusalMsg,
        registration_terms_enabled: registrationTerms,
        registration_terms_url: registrationTermsUrl,
        check_in_enabled: enableCheckIn,
        check_in_participant_enabled: checkInParticipant,
        check_in_participant_start_datetime: checkInStartDateTime,
        check_in_participant_end_datetime: checkInEndDateTime,
        team_min_size: teamMinSize,
        team_max_size: teamMaxSize,
      },
    });

    return NextResponse.json(updatedTournament);
  } catch (error) {
    return new Response("Error updating tournament settings", { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    // Get the route params
    const tournamentId = params.id;

    // Check if the user has access to the tournament
    if (!(await verifyCurrentUserHasAccessToTournament(tournamentId))) {
      return new Response("Unauthorized access", { status: 403 });
    }

    await prisma.tournament.delete({
      where: {
        id: tournamentId,
      },
    });

    return NextResponse.json({
      message: "Tournament deleted successfully",
      staus: 204,
    });
  } catch (error) {
    return new Response("Error deleting tournament");
  }
}

async function verifyCurrentUserHasAccessToTournament(id: string) {
  const session = await getServerSession(authOptions);
  const count = await prisma.tournament.count({
    where: {
      id: id,
      userId: session?.user.id,
    },
  });

  return count > 0;
}
