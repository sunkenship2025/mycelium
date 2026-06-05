# Description: Setup the environment for Mycelium development.
#
# For further documentation refer to [Mycelium Plugin Quickstart]:
# https://docs.mycelium.so/notes/64f0e2d5-2c83-43df-9144-40f2c68935aa/
main() {
  export MYCELIUM_MONOREPO="${PWD:?}"

  "${MYCELIUM_MONOREPO:?}"/shell/setup.sh
}

main "${@}" || exit 1
