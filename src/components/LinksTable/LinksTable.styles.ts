import { createStyles } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  table: {
    // borderRadius: theme.radius.md,
    // paddingTop: theme.spacing.md * 3,
    // paddingBottom: theme.spacing.md * 3,
    // boxShadow: theme.shadows.sm,
    // backgroundColor: theme.colors.gray[2],
    boxShadow: theme.shadows.md,

    borderCollapse: "separate",
    borderSpacing: 0,

    borderBottomLeftRadius: theme.radius.md,
    borderBottomRightRadius: theme.radius.md,

    "& thead tr th": {
      padding: "1rem 1.25rem",
    },

    "& tbody tr td": {
      padding: "0.75rem 1rem",
    },
  },
  tableHead: {
    backgroundColor: theme.colors.gray[1],
  },
  tableLeftHead: {
    borderTopLeftRadius: theme.radius.md,
  },

  tableRightHead: {
    borderTopRightRadius: theme.radius.md,
  },

  tableInner: {
    tableLayout: "fixed",
    borderCollapse: "collapse",
    width: "100%",
    // backgroundColor: theme.colors.gray[3],
  },

  td: {
    padding: "25px",
    whiteSpace: "nowrap",
  },

  rowSelected: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.fn.rgba(theme.colors[theme.primaryColor][7], 0.2)
        : theme.colors[theme.primaryColor][0],
  },
}));

export default useStyles;
