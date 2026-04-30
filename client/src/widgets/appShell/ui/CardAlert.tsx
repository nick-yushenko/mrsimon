import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";

// TODO сделать этот компонент важными текущими уведомлениями (решить, системными или пользовательскими):
// "9 марта учебный день", "Возможны неполадки в работе", "У вас задолженность 300р", "открыта запись на сдачу IELTS" и тд
export default function CardAlert() {
  return (
    <>
      <Card variant="outlined" sx={{ m: 1.5, flexShrink: 0 }}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <AutoAwesomeRoundedIcon fontSize="small" />
            <Typography sx={{ fontWeight: 600 }}>Оплата обучения</Typography>
            <Box
              component={Button}
              variant="text"
              sx={{ ml: "auto", cursor: "pointer", minWidth: "20px", borderRadius: "20px", p: 0 }}
            >
              <CloseIcon fontSize="small" sx={{ color: "grey.600" }} />
            </Box>
          </Box>

          <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
            Не зубудьте пополнить баланс до 1го числа на сумму 4000р
          </Typography>
          <Button variant="contained" size="small" fullWidth>
            Пополнить
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
