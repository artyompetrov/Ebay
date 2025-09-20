namespace Server.Application.Services.Measurement.QuickTest;

public record ParseAndPrettifyQuickTestResult(
    TubeType TubeType,
    SectionTest Section1,
    SectionTest? Section2
)
{
    //todo реализовать функцию pretty вывода результата quick test
    /*
     пример результата
     
     для пентодов:
     
     Test conditions:
     Va  : 200 (V)
     Vs  : 135 (V)
     Vg  : -3 (V)
     
     Test results:
     Ia  : 5,76 (mA)
     Gma : 1,74 (mA/V)
     Ra  : 658,97 (kohm)
     mu1 : 1148 (-)
     Gm1 : 92 (uA/V)
     
     Is  : 1,05 (mA)
     Gms : 347 (uA/V)
     Rs  : 54,9 (kohm)
     mu2 : 19 (-)
     Gm2 : 0 (uA/V)
     
     для двойных триодов:
     SECTION 1
     
     Test conditions:
     Va  : 250 (V)
     Vg  : -8 (V)
     
     Test results:
     Ia  : 8,27 (mA)
     Ra  : 7,51 (kohm)
     Gm  : 2,58 (mA/V)
     mu  : 19 (-)
     
     SECTION 2
     
     Test conditions:
     Va  : 250 (V)
     Vg  : -8 (V)
     
     Test results:
     Ia  : 7,86 (mA)
     Ra  : 7,72 (kohm)
     Gm  : 2,51 (mA/V)
     mu  : 19 (-)
     
     для обычных триодов
     
     SECTION 1
     Test conditions:
     Va  : 120 (V)
     Vg  : -30 (V)
     
     Test results:
     Ia  : 281,93 (mA)
     Ra  : 106 (ohm)
     Gm  : 20,29 (mA/V)
     mu  : 2 (-)
     
     */
    public string PrettyQuickTestResult => throw new NotImplementedException();
}