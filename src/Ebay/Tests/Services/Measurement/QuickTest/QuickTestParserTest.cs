using Server.Application.Services.Measurement.QuickTest;

namespace Tests.Services.Measurement.QuickTest;

[TestFixture]
[TestOf(typeof(QuickTestParser))]
public class QuickTestParserTest
{
  /*
         Пример входных данных (для каждого типа ламп - это должно оказаться входными данными для теста):
         
Triode:
20.06.2025 13:09:07   uTracer3, GUI  V3.11  Triode Quick Test

SECTION 1
 
Test conditions:
Va  : 120 (V)                Swing +/- 12 V (10%)
Vg  : -30 (V)                Swing +/- 3 V (10%)
 
Test results:
Ia  : 271,83 (mA)            97 % of nominal 280 (mA)            
Ra  : 111 (ohm)              0 % of nominal 106 (kohm)          Ra = dVa/dIa
Gm  : 20,36 (mA/V)           102 % of nominal 20 (mA)           Gm = dIa/dVg
mu  : 2 (-)                  113 % of nominal 2 (-)             mu = Gm*Ra
 
 
SECTION 2
 
Test conditions:
Va  : 120 (V)                Swing +/- 12 V (10%)
Vg  : -30 (V)                Swing +/- 3 V (10%)
 
Test results:
Ia  : 0 (mA)                 0 % of nominal 280 (mA)             
Ra  : > 1M (ohm)             --- % of nominal 106 (kohm)        Ra = dVa/dIa
Gm  : 0 (mA/V)               0 % of nominal 20 (mA/V)           Gm = dIa/dVg
mu  : N.A. (-)               --- % of nominal 2 (-)             mu = Gm*Ra


DoubleTriode:
20.06.2025 13:09:07   uTracer3, GUI  V3.11  Triode Quick Test
 

 
SECTION 1
 
Test conditions:
Va  : 120 (V)                Swing +/- 12 V (10%)
Vg  : -30 (V)                Swing +/- 3 V (10%)
 
Test results:
Ia  : 271,83 (mA)            97 % of nominal 280 (mA)            
Ra  : 111 (ohm)              0 % of nominal 106 (kohm)          Ra = dVa/dIa
Gm  : 20,36 (mA/V)           102 % of nominal 20 (mA)           Gm = dIa/dVg
mu  : 2 (-)                  113 % of nominal 2 (-)             mu = Gm*Ra
 
 
SECTION 2
 
Test conditions:
Va  : 120 (V)                Swing +/- 12 V (10%)
Vg  : -30 (V)                Swing +/- 3 V (10%)
 
Test results:
Ia  : 0 (mA)                 0 % of nominal 280 (mA)             
Ra  : > 1M (ohm)             --- % of nominal 106 (kohm)        Ra = dVa/dIa
Gm  : 0 (mA/V)               0 % of nominal 20 (mA/V)           Gm = dIa/dVg
mu  : N.A. (-)               --- % of nominal 2 (-)             mu = Gm*Ra


Pentode:
27.05.2025 17:53:37   uTracer3, GUI  V3.11  Pentode Quick Test
 

 
Test conditions:
Va  : 200 (V)                Swing +/- 50 V (25%)
Vs  : 135 (V)                Swing +/- 33,75 V (25%)
Vg  : -3 (V)                 Swing +/- 0,75 V (25%)
 
Test results:
Ia  : 4,93 (mA)              90 % of nominal 5,5 (mA)            
Gma : 1,72 (mA/V)            93 % of nominal 1,85 (mA/V)        Gma = dIa/dVg
Ra  : 654,57 (kohm)          131 % of nominal 500 (kohm)        Ra  = dVa/dIa
mu1 : 1124 (-)               112 % of nominal 1000 (-)          mu1 = Gma*Ra
Gm1 : 83 (uA/V)                                                 Gm1 = dIa/dVs
 
Is  : 0,86 (mA)              82 % of nominal 1,05 (mA)           
Gms : 312 (uA/V)                                                Gma = dIs/dVg
Rs  : 63,31 (kohm)                                              Rs  = dVs/dIs
mu2 : 20 (-)                                                    mu2 = Gms*Rs
Gm2 : 0 (uA/V)                                                  Gm2 = dIs/dVa

         */
        
    [Test]
    public void METHOD()
    {
        //todo реализовать тесты
    }
}