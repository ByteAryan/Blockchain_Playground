const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

const parse = (n) => ethers.parseUnits(n.toString(), 18);
const INITIAL = parse(100_000);

describe("MyToken", function () {
  async function deployFixture() {
    const [owner, alice, bob] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("MyToken");
    const token = await Token.deploy(owner.address, INITIAL);
    return { token, owner, alice, bob };
  }

  describe("Deployment", function () {
    it("sets name, symbol and decimals", async function () {
      const { token } = await loadFixture(deployFixture);
      expect(await token.name()).to.equal("MyToken");
      expect(await token.symbol()).to.equal("MTK");
      expect(await token.decimals()).to.equal(18);
    });

    it("mints the initial supply to the owner", async function () {
      const { token, owner } = await loadFixture(deployFixture);
      expect(await token.totalSupply()).to.equal(INITIAL);
      expect(await token.balanceOf(owner.address)).to.equal(INITIAL);
    });

    it("sets the owner and the cap", async function () {
      const { token, owner } = await loadFixture(deployFixture);
      expect(await token.owner()).to.equal(owner.address);
      expect(await token.cap()).to.equal(parse(1_000_000));
    });
  });

  describe("Transfers", function () {
    it("moves tokens and emits Transfer", async function () {
      const { token, owner, alice } = await loadFixture(deployFixture);
      await expect(token.transfer(alice.address, parse(50)))
        .to.emit(token, "Transfer")
        .withArgs(owner.address, alice.address, parse(50));
      expect(await token.balanceOf(alice.address)).to.equal(parse(50));
    });

    it("reverts when balance is too low", async function () {
      const { token, alice, bob } = await loadFixture(deployFixture);
      await expect(
        token.connect(alice).transfer(bob.address, 1)
      ).to.be.revertedWithCustomError(token, "ERC20InsufficientBalance");
    });

    it("supports approve + transferFrom", async function () {
      const { token, owner, alice, bob } = await loadFixture(deployFixture);
      await token.approve(alice.address, parse(100));
      expect(await token.allowance(owner.address, alice.address)).to.equal(parse(100));

      await token.connect(alice).transferFrom(owner.address, bob.address, parse(40));
      expect(await token.balanceOf(bob.address)).to.equal(parse(40));
      expect(await token.allowance(owner.address, alice.address)).to.equal(parse(60));
    });

    it("blocks transferFrom above the allowance", async function () {
      const { token, owner, alice, bob } = await loadFixture(deployFixture);
      await token.approve(alice.address, parse(10));
      await expect(
        token.connect(alice).transferFrom(owner.address, bob.address, parse(11))
      ).to.be.revertedWithCustomError(token, "ERC20InsufficientAllowance");
    });
  });

  describe("Minting", function () {
    it("lets the owner mint", async function () {
      const { token, alice } = await loadFixture(deployFixture);
      await token.mint(alice.address, parse(500));
      expect(await token.balanceOf(alice.address)).to.equal(parse(500));
    });

    it("rejects minting from non-owners", async function () {
      const { token, alice } = await loadFixture(deployFixture);
      await expect(
        token.connect(alice).mint(alice.address, 1)
      ).to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");
    });

    it("cannot exceed the max supply", async function () {
      const { token, alice } = await loadFixture(deployFixture);
      await expect(
        token.mint(alice.address, parse(900_001))
      ).to.be.revertedWithCustomError(token, "ERC20ExceededCap");
      await token.mint(alice.address, parse(900_000)); // exactly the cap is fine
      expect(await token.totalSupply()).to.equal(parse(1_000_000));
    });
  });

  describe("Burning", function () {
    it("reduces balance and total supply", async function () {
      const { token, owner } = await loadFixture(deployFixture);
      await token.burn(parse(1_000));
      expect(await token.totalSupply()).to.equal(INITIAL - parse(1_000));
      expect(await token.balanceOf(owner.address)).to.equal(INITIAL - parse(1_000));
    });
  });

  describe("Pausing", function () {
    it("blocks transfers while paused and restores them after", async function () {
      const { token, alice } = await loadFixture(deployFixture);
      await token.pause();
      await expect(
        token.transfer(alice.address, 1)
      ).to.be.revertedWithCustomError(token, "EnforcedPause");
      await token.unpause();
      await expect(token.transfer(alice.address, 1)).to.not.be.reverted;
    });

    it("only the owner can pause", async function () {
      const { token, alice } = await loadFixture(deployFixture);
      await expect(
        token.connect(alice).pause()
      ).to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");
    });
  });
});
