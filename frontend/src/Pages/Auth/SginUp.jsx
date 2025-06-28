import React, { useContext, useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { validateEmail } from "../../utils/helper";
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector";
import Input from "../../components/Inputs/Input";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext";
import uploadImage from "../../utils/uploadImages";
import toast from "react-hot-toast";

const SginUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminInviteToken, setAdminInviteToken] = useState("");


  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { updateUser } = useContext(UserContext);

  const handleSginup = async (e) => {

    e.preventDefault();
    let profileImageUrl = ''

    if (!fullName) {
      setError("Enter Full Name");
      return;
    }
    if (!validateEmail(email)) {
      setError("Enter valid Email address");
      return;
    }
    if (!password) {
      setError("Enter valid Password");
      return;
    }

    setError("");

    //Sginup API calls

    try {
      //Upload image if present 

      if(profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes || '';
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullName,
        email,
        profileImageUrl:profileImageUrl.imageUrl,
        password,
        adminInviteToken,
      });

      const { token, role } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);

        toast.success("Sginuped SuccessFully");
        //Redirect based on role
        if (role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/dashboard");
        }
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else setError("Something went wrong. Please try again");
    }
  };
  return (
    <AuthLayout>
      <div className="lg:w-[100%] h-auto md:h-full mt-4 md:mt-2 flex flex-col  justify-center">
        <h3 className="text-xl font-semibold text-black">Create an Account</h3>
        <p className="text-xs text-slate-700 mt-[6px] mb-6">
          Join us today by entering your details below
        </p>

        <form onSubmit={handleSginup}>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="text"
              value={fullName}
              onChange={({ target }) => setFullName(target.value)}
              label="Full Name"
              placeholder="John"
            />

            <Input
              value={email}
              type="text"
              onChange={({ target }) => setEmail(target.value)}
              label="Email Address"
              placeholder="john@example.com"
            />

            <Input
              value={password}
              type="password"
              onChange={({ target }) => setPassword(target.value)}
              label="Password"
              placeholder="Min 8 Characters"
            />
            <Input
              value={adminInviteToken}
              type="text"
              onChange={({ target }) => setAdminInviteToken(target.value)}
              label="Admin Invite Token"
              placeholder="6 Digit Code"
            />
            <div className="md:w-[60vw] w-full">
              {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

              <button
                onClick={handleSginup}
                type="submit"
                className="btn-primary"
              >
                SIGN UP
              </button>

              <p className="text-[13px] text-slate-800 mt-3">
                Already have an account?{" "}
                <Link
                  className="font-medium text-primary underline"
                  to="/login"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

export default SginUp;
