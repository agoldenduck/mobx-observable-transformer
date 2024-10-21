import { AsyncDiagnostic, AsyncRule, Lintable, Rule } from "./Rule";

export type ImageProcessingDangerZoneId = "image_processing_danger_zone";

export type ImageProcessingDangerZoneInfo = {
  components: {}[];
};

export type ImageProcessingDangerZoneConfig = {
  dangerZoneSvgPath: string;
};

export class ImageProcessingDangerZoneRule
  implements AsyncRule<ImageProcessingDangerZoneId>
{
  checkFixed(
    lintable: Lintable
  ): AsyncDiagnostic<ImageProcessingDangerZoneId>[] {
    throw new Error("Method not implemented.");
  }
}
