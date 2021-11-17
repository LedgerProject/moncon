import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Container } from "@material-ui/core";
import DemoField from "./DemoField";
import { useStyles } from "./styled";
import {
  credential_mobil,
  credential_email,
  credential_country,
  credential_birthday,
  credential_region
} from "../../Const";
import MonconImg from "../../Assets/img/MonconImg";

const Documents = () => {
  const classes = useStyles();
  const mobile = useSelector((state) => state.UserReducer[credential_mobil]);
  const email = useSelector((state) => state.UserReducer[credential_email]);
  const datebirth = useSelector(
    (state) => state.UserReducer[credential_birthday]
  );
  const dinamycFields = useSelector((state) => state.UserReducer.dynamicFields);
  const country = useSelector((state) => state.UserReducer[credential_country]);
  const region = useSelector((state) => state.UserReducer[credential_region]);
  console.log(mobile);
  console.log(email);
  console.log(datebirth)
  console.log(dinamycFields)
  console.log(country)

  return (
    <div style={{ marginBottom: "30px" }}>
      {
        email.status || mobile.status || datebirth.status || country.status  || region.status? (
          <Container>
            <h1 className={classes.titleCredentials}>Credentials</h1>
            {
              email.status && (
                <DemoField
                  to="/documents/demo/email"
                  path={credential_email}
                  title="Email"
                  field="email"
                />
              )
            }
            {
              mobile.status && (
                <DemoField
                  to="/documents/demo/mobile"
                  path={credential_mobil}
                  title="Mobile Phone"
                  field="phone"
                />
              )
            }
          {
            datebirth.status && (
              <DemoField
                to="/documents/demo/datebirth"
                path={credential_birthday}
                title="Date Birth"
                field="birthday"
              />
            )
          }
          {
            country.status && (
              <div
                className={classes.proofContainer}
                style={{ marginTop: "20px" }}
              >
                <Link
                  to={`/documents/demo/country`}
                  style={{ textDecoration: "none" }}
                >
                  <h1 className={classes.proofTitle}>
                    Proof Of ID Credential Demo
                  </h1>
                  <div className={classes.contentPersonal}>
                    <Link to={`/documents/demo/country`} className={classes.fab}>
                      <MonconImg />
                    </Link>
                    <div>
                      <div className={classes.proofSubtitle}>Country of Residence</div>
                      <Link
                        to="/"
                        className={classes.link}
                        style={{ textDecoration: "none" }}
                      >
                        {country.value}
                      </Link>
                    </div>
                  </div>
                </Link>
              </div>
            )
          }
          {
            region.status && (
              <div
                className={classes.proofContainer}
                style={{ marginTop: "20px" }}
              >
                <Link
                  to={`/documents/demo/region`}
                  style={{ textDecoration: "none" }}
                >
                  <h1 className={classes.proofTitle}>
                    Proof Of ID Credential Demo
                  </h1>
                  <div className={classes.contentPersonal}>
                    <Link to={`/documents/demo/region`} className={classes.fab}>
                      <MonconImg />
                    </Link>
                    <div>
                      <div className={classes.proofSubtitle}>Region of Residence</div>
                      <Link
                        to="/"
                        className={classes.link}
                        style={{ textDecoration: "none" }}
                      >
                        {region.value}
                      </Link>
                    </div>
                  </div>
                </Link>
              </div>
            )
          }

          {
            dinamycFields.map((values, index) => {
              return (
                values.status === true && (
                  <div key={index}>
                    <div
                      className={classes.proofContainer}
                      style={{ marginTop: "20px" }}
                    >
                      <Link
                        to={`/documents/demo/field/${values.id}`}
                        style={{ textDecoration: "none" }}
                      >
                        <h1 className={classes.proofTitle}>
                          Proof Of ID Credential Demo
                        </h1>
                        <div className={classes.contentPersonal}>
                          <Link
                            to={`/documents/demo/field/${values.id}`}
                            className={classes.fab}
                          >
                            <MonconImg />
                          </Link>
                          <div>
                            <div className={classes.proofSubtitle}>
                              {values.id}
                            </div>
                            <Link
                              to="/"
                              className={classes.link}
                              style={{ textDecoration: "none" }}
                            >
                              {values.value}
                            </Link>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                )
              );
            })
          }
        </Container>
      ) : (
        <>
          <div
            style={{
              alignItems: "center",
              display: "flex",
              justifyContent: "center",
              textAlign: "center",
              position: "absolute",
              left: 0,
              top: 0,
              right: 0,
              bottom: 0,
              color: "rgba(0, 0, 0, 0.6)",
              fontSize: "20px",
              fontWeight: 500,
            }}
          >
            There are no credentials yet
          </div>
        </>
      )}
    </div>
  );
};
export default Documents;
