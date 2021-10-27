import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Container } from "@material-ui/core";
import DemoField from "./DemoField";
import { useStyles } from "./styled";
import {
  credential_mobil,
  credential_email,
  credential_address,
  credential_birthday,
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
  const address = useSelector((state) => state.UserReducer[credential_address]);
  console.log(mobile);
  console.log(email);
  console.log(datebirth)
  console.log(dinamycFields)
  console.log(address)

  return (
    <div style={{ marginBottom: "30px" }}>
      {
        email.status || mobile.status || datebirth.status || address.status ? (
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
            address.status && (
              <div
                className={classes.proofContainer}
                style={{ marginTop: "20px" }}
              >
                <Link
                  to={`/documents/demo/postal`}
                  style={{ textDecoration: "none" }}
                >
                  <h1 className={classes.proofTitle}>
                    Proof Of ID Credential Demo
                  </h1>
                  <div className={classes.contentPersonal}>
                    <Link to={`/documents/demo/postal`} className={classes.fab}>
                      <MonconImg />
                    </Link>
                    <div>
                      <div className={classes.proofSubtitle}>Postal Adress</div>
                      <Link
                        to="/"
                        className={classes.link}
                        style={{ textDecoration: "none" }}
                      >
                        {address.value.address}
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
