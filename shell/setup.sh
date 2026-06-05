# Description: Setup the environment for Mycelium development.
#
# Pre-requisites:
# - MYCELIUM_MONOREPO environment variable must be set.
#   It should point to mycelium's monorepo
#   (directory where you cloned https://github.com/myceliumhq/mycelium.git into)
#
# This script is based off of https://docs.mycelium.so/notes/64f0e2d5-2c83-43df-9144-40f2c68935aa/

# -z: returns true when value is empty.
if [[ -z "${MYCELIUM_MONOREPO}" ]]; then
  echo "MYCELIUM_MONOREPO environment variable is not set. Please set it to mycelium's monorepo directory."
  exit 1
fi

if [[ -f "${MYCELIUM_MONOREPO:?}"/shell/_util.sh ]]
then
	source "${MYCELIUM_MONOREPO:?}"/shell/_util.sh
else
  echo "File not found: ${MYCELIUM_MONOREPO:?}/shell/_util.sh"
  exit 1
fi

_setup_node_version(){
  # NVM is often not propagated to subshells. This is a workaround to
  # allow usage of NVM within the script.
  source_robust "${MYCELIUM_MONOREPO:?}"/shell/_setup_nvm_source_me.sh

  # We need to source verification of NVM due to subshell issue mentioned above.
  source_robust "${MYCELIUM_MONOREPO:?}"/shell/_verify_nvm_source_me.sh

  # There is an issue with node 17+ and `yarn setup` that causes an error.
  # Node 16 is the latest version that works with `yarn setup` with
  # current mycelium setup.
  #
  # Another option to try is to use later node version with:
  # export NODE_OPTIONS=--openssl-legacy-provider
  #
  # However, it seems more robust to pick a node version that is known to work.
  # Hence, we are setting node version to 16.
  eae nvm install 16
  eae nvm use 16
}

main_impl(){
  eae _setup_node_version

  eae npm install -g yarn
  eae npm install -g lerna

  eae cd "${MYCELIUM_MONOREPO:?}"

  echo "install workspace dependencies..."
  eae yarn

  echo "install package dependencies..."
  eae yarn setup
}

main() {
  echo_green "Starting ${0}..."

  eae "${MYCELIUM_MONOREPO:?}"/shell/_verify_env_variables.sh
  eae "${MYCELIUM_MONOREPO:?}"/shell/_verify_node_version.sh
  eae "${MYCELIUM_MONOREPO:?}"/shell/_verify_npm.sh
  eae "${MYCELIUM_MONOREPO:?}"/shell/_verify_yarn.sh

  main_impl

  echo "--------------------------------------------------------------------------------"
  echo_green "Finished ${0} successfully. For further documentation refer to https://docs.mycelium.so/notes/64f0e2d5-2c83-43df-9144-40f2c68935aa/ . Particularly look for the part that talks about 'mycelium-main.code-workspace' (And use File->Open Workspace from file... to open 'mycelium/mycelium-main.code-workspace'). Also look for './watch.sh' which wraps the watch command."
}

main "${@}" || exit 1
