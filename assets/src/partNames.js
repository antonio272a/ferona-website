// 42481: {
//     name: "PA001 TC",
//     "[top](01)": "",
//     "[top](02){01}": "",
//     "[top](03){01}": "",
//     "[bottom](01)": ""
//   },

const partNamesReference = {
  42444: {
    name: "DR 001",
    "[top](01)": "DR001",
  },
  42476: {
    name: "PA001 TA",
    "[top](01)": "TA001",
    "[top](02){01}#[top](01)$": "TA002",
    "[subpart][top](03){01}#[top](01)$": "TA003-LINE",
    "[top](03){01}": "TA003-SLEEVES",
    "[bottom](01)": "PA001",
  },
  42478: {
    name: "PA001 TB",
    "[top](01)": "TB001",
    "[top](02){01}": "TB002",
    "[top](03){01}": "TB003-FRILL",
    "[subpart][top](03){01}#[top](01)$": "TB003-SLEEVES",
    "[bottom](01)": "PA001",
  },
  42481: {
    name: "PA001 TC",
    "[top](01)": "TC001",
    "[top](02){01}": "TC002",
    "[top](03){01}": "TC003",
    "[bottom](01)": "PA001",
  },
  42480: {
    name: "PA001 TD",
    "[top](01)": "TD001",
    "[bottom](01)": "PA001",
  },
  42508: {
    name: "PA002 TA",
    "[top](01)": "TA001",
    "[top](02){01}#[top](01)$": "TA002",
    "[top](03){01}": "TA003-SLEEVES",
    "[subpart][top](03){01}#[top](01)$": "TA003-LINE",
    "[bottom](01)": "PA002",
  },
  42509: {
    name: "PA002 TB",
    "[top](01)": "TB001",
    "[top](02){01}": "TB002",
    "[top](03){01}": "TB003-FRILL",
    "[subpart][top](03){01}#[top](01)$": "TB003-SLEEVES",
    "[bottom](01)": "PA002",
  },
  42510: {
    name: "PA002 TC",
    "[top](01)": "TC001",
    "[top](02){01}": "TC002",
    "[top](03){01}": "TC003",
    "[bottom](01)": "PA002",
  },
  42519: {
    name: "PA002 TD",
    "[top](01)": "TD001",
    "[bottom](01)": "PA002",
  },
  42487: {
    name: "SA001 TA",
    "[top](01)": "TA001",
    "[top](02){01}": "TA002",
    "[top](03){01}": "TA003-SLEEVES",
    "[subpart][top](03){01}#[top](01)$": "TA003-LINE",
    "[bottom](01)": "SD002-FRILL",
    "[subpart][bottom](01){01}/06-07-05/#[top](01)$": "SD002-SKIRT",
  },
  missing: {
    name: "SA001 TB",
    "[top](01)": "TA001",
    "[top](02){01}": "",
    "[top](03){01}": "",
    "[bottom](01)": "SD002",
  },
  42489: {
    name: "SA001 TC",
    "[top](01)": "TC001",
    "[top](02){01}": "TC002",
    "[top](03){01}": "TC003",
    "[bottom](01)": "SD002-FRILL",
    "[subpart][top](01){01}/07/#[top](01)$": "SD002-SKIRT",
  },
  42494: {
    name: "SA001 TD",
    "[top](01)": "TD001",
    "[subpart][bottom](01){04}": "TD001-SKIRT",
    "[bottom](01)": "SA001-FRILL",
  },
  42499: {
    name: "SC001 TA",
    "[top](01)": "TA001",
    "[top](02){01}#[top](01)$": "TA002",
    "[top](03){01}": "TA003-SLEEVES",
    "[subpart][top](03){01}#[top](01)$": "TA003-LINE",
    "[bottom](01)": "SC001",
  },
  42500: {
    name: "SC001 TB",
    "[top](01)": "TB001",
    "[top](02){01}": "TB002",
    "[top](03){01}": "TB003-FRILL",
    "[subpart][top](03){01}#[top](01)$": "TB003-SLEEVES",
    "[bottom](01)": "SC001",
  },
  42501: {
    name: "SC001 TC",
    "[top](01)": "TC001",
    "[top](02){01}": "TC002",
    "[top](03){01}": "TC003",
    "[bottom](01)": "SC001",
  },
  42502: {
    name: "SC001 TD",
    "[top](01)": "TD001",
    "[bottom](01)": "SC001",
  },
  42548: {
    name: "SC002 TA",
    "[top](01)": "TA001",
    "[top](02){01}#[top](01)$": "TA002",
    "[top](03){01}": "TA003-SLEEVES",
    "[subpart][top](03){01}#[top](01)$": "TA003-LINE",
    "[bottom](01)": "SC002",
  },
  42575: {
    name: "SC002 TB",
    "[top](01)": "TB001",
    "[top](02){01}": "TB002",
    "[top](03){01}": "TB003-FRILL",
    "[subpart][top](03){01}#[top](01)$": "TB003-SLEEVES",
    "[bottom](01)": "SC002",
  },
  42576: {
    name: "SC002 TC",
    "[top](01)": "TC001",
    "[top](02){01}": "TC002",
    "[top](03){01}": "TC003",
    "[bottom](01)": "SC002",
  },
  42577: {
    name: "SC002 TD",
    "[top](01)": "TD001",
    "[bottom](01)": "SC002",
  },
  42503: {
    name: "SD001 TA",
    "[top](01)": "TA001",
    "[top](02){01}#[top](01)$": "TA002",
    "[top](03){01}": "TA003-SLEEVES",
    "[subpart][top](03){01}#[top](01)$": "TA003-LINE",
    "[bottom](01)": "SD001",
  },
  42504: {
    name: "SD001 TB",
    "[top](01)": "TB001",
    "[top](02){01}": "TB002",
    "[top](03){01}": "TB003-FRILL",
    "[subpart][top](03){01}#[top](01)$": "TB003-SLEEVES",
    "[bottom](01)": "SD001",
  },
  42505: {
    name: "SD001 TC",
    "[top](01)": "TC001",
    "[top](02){01}": "TC002",
    "[top](03){01}": "TC003",
    "[bottom](01)": "SD001",
  },
  42506: {
    name: "SD001 TD",
    "[top](01)": "TD001",
    "[bottom](01)": "SD001",
  },
  42578: {
    name: "SD002 TA",
    "[top](01)": "TA001",
    "[top](02){01}#[top](01)$": "TA002",
    "[top](03){01}": "TA003-SLEEVES",
    "[subpart][top](03){02}#[top](01)$": "TA003-LINES",
    "[bottom](01)": "SD002",
  },
  42579: {
    name: "SD002 TB",
    "[top](01)": "TB001",
    "[top](02){01}": "TB002",
    "[top](03){01}": "TB003-FRILL",
    "[subpart][top](03){01}#[top](01)$": "TB003-SLEEVES",
    "[bottom](01)": "SD002",
  },
  42580: {
    name: "SD002 TC",
    "[top](01)": "TC001",
    "[top](02){01}": "TC002",
    "[top](03){01}": "TC003",
    "[bottom](01)": "SD002",
  },
  42581: {
    name: "SD002 TD",
    "[top](01)": "TD001",
    "[bottom](01)": "SD002",
  },
  42507: {
    name: "TD001",
    "[top](01)": "TD001",
    "[bottom](01)": "SD002",
  },
};