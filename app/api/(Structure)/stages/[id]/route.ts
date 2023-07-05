import prisma from "@/lib/prisma";

interface Params {
  params: {
    id: string;
  };
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const stageId = params.id;
    const { number, name, settings, matchSettings, autoPlacement } =
      await request.json();

    await prisma.stage.update({
      where: {
        id: stageId,
      },
      data: {
        number,
        name,
        settings,
        match_settings: matchSettings,
        auto_placement_enabled: autoPlacement,
      },
    });

    return new Response(null, { status: 200 });
  } catch (error) {
    return new Response("Error updating stage", { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    const stageId = params.id;

    await prisma.stage.delete({
      where: {
        id: stageId,
      },
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}
