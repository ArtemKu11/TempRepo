export type TimelapseMode = 'layermacro' | 'hyperlapse';
export type ParkPosition = 'custom' | 'front_left' | 'front_right' | 'center' | 'back_left' | 'back_right' | 'x_only' | 'y_only';

export interface TimelapseWritableSettings {
  // settings card
  enabled: boolean;
  autorender: boolean;

  // settings page
  camera: string;
  mode: TimelapseMode;
  hyperlapse_cycle: number;
  parkhead: boolean;
  parkpos: ParkPosition;
  park_time: number;
  park_travel_speed: number;
  park_custom_pos_x: number;
  park_custom_pos_y: number;
  park_custom_pos_dz: number;
  fw_retract: boolean;
  park_retract_distance: number;
  park_retract_speed: number;
  park_extrude_distance: number;
  park_extrude_speed: number;
  stream_delay_compensation: number;
  gcode_verbose: boolean;

  // render card
  variable_fps: boolean;
  targetlength: number;
  variable_fps_min: number;
  variable_fps_max: number;
  output_framerate: number;
  saveframes: boolean;
  duplicatelastframe: number;
  constant_rate_factor: number;
  previewimage: boolean;

  // not in UI yet, low priority
  time_format_code: string;
  pixelformat: string;
  extraoutputparams: string;
}