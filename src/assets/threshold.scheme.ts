// all should be calculated by statistics of player-base
// instead of arbitrary set up

// also it should be different for different modes, and types of vehicles
// or even different for each vehicle

export const wr_thresholds = {
  terrible:       .41,
  bad:            .46,
  below_average:  .49,
  average:        .52,
  above_average:  .54,
  good:           .56,
  excellent:      .59,
  outstanding:    .63,
  madlad:         .69,
}

// possibly should be different for ground and air units
export const kdr_thresholds = {
  terrible:       0.75,
  bad:            1.00,
  below_average:  1.25,
  average:        1.50,
  above_average:  1.75,
  good:           2.00,
  excellent:      2.25,
  outstanding:    2.50,
  madlad:         3.00,
}

// should be a bit lower than kdr
export const ksr_thresholds = {
  terrible:       0.75,
  bad:            1.00,
  below_average:  1.25,
  average:        1.50,
  above_average:  1.75,
  good:           2.00,
  excellent:      2.25,
  outstanding:    2.50,
  madlad:         3.00,
}
